import { create } from 'zustand';
import { JobApplication, InterviewNote, mockJobApplications } from '@/lib/job-tracker-data';

interface JobStats {
  total: number;
  byStatus: Record<string, number>;
  conversionRate: number;
}

interface JobTrackerState {
  jobs: JobApplication[];
  selectedJobId: string | null;
  stats: JobStats;

  // Actions
  setJobs: (jobs: JobApplication[]) => void;
  addJob: (job: JobApplication) => void;
  updateJob: (id: string, job: Partial<JobApplication>) => void;
  deleteJob: (id: string) => void;
  selectJob: (id: string) => void;
  addInterviewNote: (jobId: string, note: InterviewNote) => void;
  updateInterviewNote: (jobId: string, noteId: string, note: Partial<InterviewNote>) => void;
  deleteInterviewNote: (jobId: string, noteId: string) => void;
  getJobById: (id: string) => JobApplication | undefined;
  getJobsByStatus: (status: string) => JobApplication[];
}

const calculateStats = (jobs: JobApplication[]): JobStats => {
  const total = jobs.length;
  const byStatus = {
    applied: jobs.filter((j) => j.status === 'applied').length,
    interview: jobs.filter((j) => j.status === 'interview').length,
    rejected: jobs.filter((j) => j.status === 'rejected').length,
    offer: jobs.filter((j) => j.status === 'offer').length,
  };

  const interviews = byStatus.interview + byStatus.rejected + byStatus.offer;
  const conversionRate = total > 0 ? (interviews / total) * 100 : 0;

  return { total, byStatus, conversionRate };
};

export const useJobTrackerStore = create<JobTrackerState>((set, get) => ({
  jobs: mockJobApplications,
  selectedJobId: null,
  stats: calculateStats(mockJobApplications),

  setJobs: (jobs) => set({ jobs, stats: calculateStats(jobs) }),

  addJob: (job) => {
    const jobs = [...get().jobs, job];
    set({ jobs, stats: calculateStats(jobs) });
  },

  updateJob: (id, updates) => {
    const jobs = get().jobs.map((job) =>
      job.id === id ? { ...job, ...updates } : job
    );
    set({ jobs, stats: calculateStats(jobs) });
  },

  deleteJob: (id) => {
    const jobs = get().jobs.filter((job) => job.id !== id);
    set({ jobs, stats: calculateStats(jobs) });
  },

  selectJob: (id) => set({ selectedJobId: id }),

  addInterviewNote: (jobId, note) => {
    const jobs = get().jobs.map((job) =>
      job.id === jobId
        ? { ...job, interviewNotes: [...job.interviewNotes, note] }
        : job
    );
    set({ jobs, stats: calculateStats(jobs) });
  },

  updateInterviewNote: (jobId, noteId, updates) => {
    const jobs = get().jobs.map((job) =>
      job.id === jobId
        ? {
          ...job,
          interviewNotes: job.interviewNotes.map((note) =>
            note.id === noteId ? { ...note, ...updates } : note
          ),
        }
        : job
    );
    set({ jobs, stats: calculateStats(jobs) });
  },

  deleteInterviewNote: (jobId, noteId) => {
    const jobs = get().jobs.map((job) =>
      job.id === jobId
        ? {
          ...job,
          interviewNotes: job.interviewNotes.filter((note) => note.id !== noteId),
        }
        : job
    );
    set({ jobs, stats: calculateStats(jobs) });
  },

  getJobById: (id) => {
    return get().jobs.find((job) => job.id === id);
  },

  getJobsByStatus: (status) => {
    return get().jobs.filter((job) => job.status === status);
  },
}));
