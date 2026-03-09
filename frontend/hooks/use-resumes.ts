import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    CreateResumeRequest,
    Resume,
    UpdateResumeRequest,
    resumeApi,
} from '@/lib/api/endpoints/resume.api';
import { useAuthStore } from '@/store/authStore';
import type { ResumeData } from '@/types/resume';
import { queryKeys } from '@/lib/queryKeys';
import { STALE_TIMES, GC_TIMES } from '@/lib/queryConfig';
import { message } from 'antd';
import { toResumeData } from '@/lib/mappers/resume.mapper';
import { resumeInvalidations } from '@/lib/api/invalidations';

interface ApiErrorLike {
    readonly response?: { readonly data?: { readonly message?: string } };
}

interface UpdateResumeInput {
    readonly id: string;
    readonly data: UpdateResumeRequest;
}

interface RestoreVersionInput {
    readonly id: string;
    readonly versionId: string;
}

interface UpdateResumeContext {
    readonly snapshot?: ResumeData;
}

type InvalidationKey = readonly unknown[];

function getCurrentUserId(): string | undefined {
    return useAuthStore.getState().user?.id;
}

function mapResumeToView(resume: Resume): ResumeData {
    return toResumeData(resume, getCurrentUserId());
}

function showMutationError(error: ApiErrorLike, fallbackMessage: string): void {
    message.error(error.response?.data?.message ?? fallbackMessage);
}

function invalidateKeys(queryClient: QueryClient, keys: readonly InvalidationKey[]): void {
    keys.forEach((queryKey) => {
        void queryClient.invalidateQueries({ queryKey });
    });
}

function mergePersonalInfo(
    current: ResumeData['personalInfo'],
    next?: UpdateResumeRequest['personalInfo']
): ResumeData['personalInfo'] {
    if (!next) return current;
    return { ...current, ...(next as Partial<ResumeData['personalInfo']>) };
}

function buildOptimisticResume(current: ResumeData, update: UpdateResumeRequest): ResumeData {
    return {
        ...current,
        ...(update as Partial<ResumeData>),
        personalInfo: mergePersonalInfo(current.personalInfo, update.personalInfo),
    };
}

async function applyOptimisticUpdate(
    queryClient: QueryClient,
    input: UpdateResumeInput
): Promise<UpdateResumeContext> {
    await queryClient.cancelQueries({ queryKey: queryKeys.resumes.byId(input.id) });
    const snapshot = queryClient.getQueryData<ResumeData>(queryKeys.resumes.byId(input.id));

    queryClient.setQueryData<ResumeData>(queryKeys.resumes.byId(input.id), (existing) => {
        if (!existing) return existing;
        return buildOptimisticResume(existing, input.data);
    });

    return { snapshot };
}

function rollbackOptimisticUpdate(
    queryClient: QueryClient,
    id: string,
    context?: UpdateResumeContext
): void {
    if (!context?.snapshot) return;
    queryClient.setQueryData(queryKeys.resumes.byId(id), context.snapshot);
}

// ── Queries ────────────────────────────────────────────────────────────────

export function useResumes() {
    return useQuery({
        queryKey: queryKeys.resumes.all(),
        queryFn: async () => {
            const result = await resumeApi.list();
            return { ...result, data: result.data.map(mapResumeToView) };
        },
        staleTime: STALE_TIMES.RESUME_LIST,
        gcTime: GC_TIMES.RESUME_LIST,
    });
}

export function useResume(id: string | null) {
    return useQuery({
        queryKey: queryKeys.resumes.byId(id ?? ''),
        queryFn: async () => {
            if (!id) throw new Error('Resume ID is required');
            const resume = await resumeApi.getById(id);
            return mapResumeToView(resume);
        },
        enabled: Boolean(id),
        staleTime: STALE_TIMES.RESUME_DETAIL,
        gcTime: GC_TIMES.RESUME_DETAIL,
    });
}

export function useResumeVersions(id: string | null) {
    return useQuery({
        queryKey: queryKeys.resumes.versions(id ?? ''),
        queryFn: () => {
            if (!id) throw new Error('Resume ID is required');
            return resumeApi.getVersions(id);
        },
        enabled: Boolean(id),
        staleTime: STALE_TIMES.VERSION_HISTORY,
        gcTime: GC_TIMES.VERSION_HISTORY,
    });
}

// ── Mutations ──────────────────────────────────────────────────────────────

export function useCreateResume() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateResumeRequest) => mapResumeToView(await resumeApi.create(data)),
        onSuccess: () => {
            invalidateKeys(queryClient, resumeInvalidations.afterCreate());
            message.success('Resume created successfully');
        },
        onError: (error: ApiErrorLike) => {
            showMutationError(error, 'Failed to create resume');
        },
    });
}

export function useUpdateResume() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: UpdateResumeInput) => mapResumeToView(await resumeApi.update(id, data)),
        onMutate: (input) => applyOptimisticUpdate(queryClient, input),
        onSuccess: (updatedResume, { id }) => {
            queryClient.setQueryData(queryKeys.resumes.byId(id), updatedResume);
            invalidateKeys(queryClient, resumeInvalidations.afterUpdate(id));
        },
        onError: (error: ApiErrorLike, { id }, context) => {
            rollbackOptimisticUpdate(queryClient, id, context);
            showMutationError(error, 'Failed to update resume');
        },
    });
}

export function useDeleteResume() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => resumeApi.delete(id),
        onSuccess: (_, id) => {
            invalidateKeys(queryClient, resumeInvalidations.afterDelete(id));
            message.success('Resume deleted');
        },
        onError: (error: ApiErrorLike) => {
            showMutationError(error, 'Failed to delete resume');
        },
    });
}

export function useDuplicateResume() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => mapResumeToView(await resumeApi.duplicate(id)),
        onSuccess: () => {
            invalidateKeys(queryClient, resumeInvalidations.afterDuplicate());
            message.success('Resume duplicated');
        },
        onError: (error: ApiErrorLike) => {
            showMutationError(error, 'Failed to duplicate resume');
        },
    });
}

export function useRestoreVersion() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, versionId }: RestoreVersionInput) =>
            mapResumeToView(await resumeApi.restoreVersion(id, versionId)),
        onSuccess: (_, { id }) => {
            invalidateKeys(queryClient, resumeInvalidations.afterVersionRestore(id));
            message.success('Version restored');
        },
        onError: (error: ApiErrorLike) => {
            showMutationError(error, 'Failed to restore version');
        },
    });
}

