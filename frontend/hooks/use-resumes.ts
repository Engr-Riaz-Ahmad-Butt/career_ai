import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { resumeApi, CreateResumeRequest, UpdateResumeRequest } from '@/lib/api/endpoints/resume.api';
import { useAuthStore } from '@/store/authStore';
import type { ResumeData } from '@/types';
import { queryKeys, invalidationKeys } from '@/lib/query-keys';
import { STALE_TIMES, GC_TIMES } from '@/lib/query-config';
import { message } from 'antd';
import { toResumeData } from '@/lib/mappers/resume.mapper';

// ── Queries ────────────────────────────────────────────────────────────────

export function useResumes() {
    return useQuery({
        queryKey: queryKeys.resumes.all(),
        queryFn: async () => {
            const userId = useAuthStore.getState().user?.id;
            const result = await resumeApi.list();
            return { ...result, data: result.data.map((r) => toResumeData(r, userId)) };
        },
        staleTime: STALE_TIMES.RESUME_LIST,
        gcTime: GC_TIMES.RESUME_LIST,
    });
}

export function useResume(id: string | null) {
    return useQuery({
        queryKey: queryKeys.resumes.byId(id ?? ''),
        queryFn: async () => {
            const userId = useAuthStore.getState().user?.id;
            const resume = await resumeApi.getById(id!);
            return toResumeData(resume, userId);
        },
        enabled: !!id,
        staleTime: STALE_TIMES.RESUME_DETAIL,
        gcTime: GC_TIMES.RESUME_DETAIL,
    });
}

export function useResumeVersions(id: string | null) {
    return useQuery({
        queryKey: queryKeys.resumes.versions(id ?? ''),
        queryFn: () => resumeApi.getVersions(id!),
        enabled: !!id,
        staleTime: STALE_TIMES.VERSION_HISTORY,
        gcTime: GC_TIMES.VERSION_HISTORY,
    });
}

// ── Mutations ──────────────────────────────────────────────────────────────

export function useCreateResume() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateResumeRequest) => {
            const userId = useAuthStore.getState().user?.id;
            const resume = await resumeApi.create(data);
            return toResumeData(resume, userId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: invalidationKeys.afterResumeCreate() });
            message.success('Resume created successfully');
        },
        onError: (error: { response?: { data?: { message?: string } } }) => {
            message.error(error.response?.data?.message ?? 'Failed to create resume');
        },
    });
}

export function useUpdateResume() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateResumeRequest }) =>
            resumeApi.update(id, data).then((r) => toResumeData(r, useAuthStore.getState().user?.id)),

        // Optimistic update: modify the cache immediately for instant UI feel
        onMutate: async ({ id, data }) => {
            // Cancel any in-flight fetches to avoid race conditions
            await queryClient.cancelQueries({ queryKey: queryKeys.resumes.byId(id) });

            // Snapshot the current value for rollback
            const snapshot = queryClient.getQueryData<ResumeData>(queryKeys.resumes.byId(id));

            // Optimistically update the cache
            queryClient.setQueryData<ResumeData>(queryKeys.resumes.byId(id), (old) => {
                if (!old) return old;
                return {
                    ...old,
                    ...(data as any),
                    personalInfo: data.personalInfo
                        ? { ...old.personalInfo, ...(data.personalInfo as any) }
                        : old.personalInfo,
                };
            });

            return { snapshot };
        },

        onSuccess: (updatedResume, { id }) => {
            // Replace with server truth
            queryClient.setQueryData(queryKeys.resumes.byId(id), updatedResume);
            queryClient.invalidateQueries({ queryKey: invalidationKeys.afterResumeListRefresh() });
        },

        onError: (error: { response?: { data?: { message?: string } } }, { id }, context) => {
            // Rollback to snapshot on failure
            if (context?.snapshot) {
                queryClient.setQueryData(queryKeys.resumes.byId(id), context.snapshot);
            }
            message.error(error.response?.data?.message ?? 'Failed to update resume');
        },
    });
}

export function useDeleteResume() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => resumeApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: invalidationKeys.afterResumeDelete() });
            message.success('Resume deleted');
        },
        onError: (error: { response?: { data?: { message?: string } } }) => {
            message.error(error.response?.data?.message ?? 'Failed to delete resume');
        },
    });
}

export function useDuplicateResume() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) =>
            resumeApi.duplicate(id).then((r) => toResumeData(r, useAuthStore.getState().user?.id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.resumes.all() });
            message.success('Resume duplicated');
        },
        onError: (error: { response?: { data?: { message?: string } } }) => {
            message.error(error.response?.data?.message ?? 'Failed to duplicate resume');
        },
    });
}

export function useRestoreVersion() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, versionId }: { id: string; versionId: string }) =>
            resumeApi.restoreVersion(id, versionId).then((r) => toResumeData(r, useAuthStore.getState().user?.id)),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.resumes.byId(id) });
            queryClient.invalidateQueries({ queryKey: queryKeys.resumes.versions(id) });
            message.success('Version restored');
        },
        onError: (error: { response?: { data?: { message?: string } } }) => {
            message.error(error.response?.data?.message ?? 'Failed to restore version');
        },
    });
}
