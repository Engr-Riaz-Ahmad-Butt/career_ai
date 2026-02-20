import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { resumeApi } from '@/lib/api/resume';

export const useResumes = () => {
    const queryClient = useQueryClient();

    const resumesQuery = (params?: any) => useQuery({
        queryKey: ['resumes', params],
        queryFn: () => resumeApi.getResumes(params),
    });

    const resumeQuery = (id: string) => useQuery({
        queryKey: ['resumes', id],
        queryFn: () => resumeApi.getResumeById(id),
        enabled: !!id,
    });

    const createResumeMutation = useMutation({
        mutationFn: resumeApi.createResume,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['resumes'] });
        },
    });

    const updateResumeMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => resumeApi.updateResume(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['resumes'] });
            queryClient.invalidateQueries({ queryKey: ['resumes', variables.id] });
        },
    });

    const deleteResumeMutation = useMutation({
        mutationFn: resumeApi.deleteResume,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['resumes'] });
        },
    });

    const duplicateResumeMutation = useMutation({
        mutationFn: resumeApi.duplicateResume,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['resumes'] });
        },
    });

    const uploadResumeMutation = useMutation({
        mutationFn: resumeApi.uploadResume,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['resumes'] });
        },
    });

    return {
        useList: resumesQuery,
        useGet: resumeQuery,
        create: createResumeMutation,
        update: updateResumeMutation,
        delete: deleteResumeMutation,
        duplicate: duplicateResumeMutation,
        upload: uploadResumeMutation,
    };
};
