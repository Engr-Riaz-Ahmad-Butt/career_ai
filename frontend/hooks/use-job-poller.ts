import { useMutation, useQuery } from '@tanstack/react-query';
import { jobsApi } from '@/lib/api/endpoints/jobs.api';
import { queryKeys } from '@/lib/query-keys';

export function useJobStatus(jobId: string | null) {
  return useQuery({
    queryKey: queryKeys.jobs.byId(jobId ?? ''),
    queryFn: () => jobsApi.getJobStatus(jobId!),
    enabled: Boolean(jobId),
    refetchInterval: (query) =>
      query.state.data?.status === 'processing' ? 2000 : false,
  });
}

export function useResumePdfJob() {
  return useMutation({
    mutationFn: (resumeId: string) => jobsApi.startResumePdfJob(resumeId),
  });
}

export function useResumeAtsScoreJob() {
  return useMutation({
    mutationFn: ({
      resumeId,
      jobDescription,
      returnSuggestions = true,
    }: {
      resumeId: string;
      jobDescription: string;
      returnSuggestions?: boolean;
    }) => jobsApi.startResumeAtsScoreJob(resumeId, { jobDescription, returnSuggestions }),
  });
}
