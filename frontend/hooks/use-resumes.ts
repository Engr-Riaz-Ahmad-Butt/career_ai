import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { resumeApi } from '@/lib/api/resume';
import { ResumeData, ResumeExperience, ResumeEducation, ResumeSkills, ResumeStyling } from '@/types';
import { message } from 'antd';

export const RESUME_KEYS = {
    all: ['resumes'] as const,
    lists: () => [...RESUME_KEYS.all, 'list'] as const,
    list: (params: any) => [...RESUME_KEYS.lists(), { params }] as const,
    details: () => [...RESUME_KEYS.all, 'detail'] as const,
    detail: (id: string) => [...RESUME_KEYS.details(), id] as const,
};

export function useResumes(params?: any) {
    return useQuery({
        queryKey: RESUME_KEYS.list(params),
        queryFn: () => resumeApi.getResumes(params),
    });
}

export function useResume(id: string | null) {
    return useQuery({
        queryKey: RESUME_KEYS.detail(id || ''),
        queryFn: () => resumeApi.getResumeById(id!),
        enabled: !!id,
    });
}

export function useCreateResume() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: any) => resumeApi.createResume(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: RESUME_KEYS.lists() });
            message.success('Resume created successfully');
        },
        onError: (error: any) => {
            message.error(error.response?.data?.message || 'Failed to create resume');
        },
    });
}

export function useUpdateResume() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => resumeApi.updateResume(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: RESUME_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: RESUME_KEYS.detail(variables.id) });
        },
        onError: (error: any) => {
            message.error(error.response?.data?.message || 'Failed to update resume');
        },
    });
}

export function useDeleteResume() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => resumeApi.deleteResume(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: RESUME_KEYS.lists() });
            message.success('Resume deleted successfully');
        },
        onError: (error: any) => {
            message.error(error.response?.data?.message || 'Failed to delete resume');
        },
    });
}

export function useDuplicateResume() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => resumeApi.duplicateResume(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: RESUME_KEYS.lists() });
            message.success('Resume duplicated successfully');
        },
        onError: (error: any) => {
            message.error(error.response?.data?.message || 'Failed to duplicate resume');
        },
    });
}
