import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { documentApi } from '@/lib/api/endpoints/document.api';
import { resumeApi } from '@/lib/api/endpoints/resume.api';
import { GC_TIMES, STALE_TIMES } from '@/lib/queryConfig';
import { queryKeys } from '@/lib/queryKeys';

export interface LibraryDocumentItem {
  readonly id: string;
  readonly title: string;
  readonly category: string;
  readonly lastModified: Date;
  readonly link: string;
}

export function useDocumentsLibrary(): {
  readonly items: readonly LibraryDocumentItem[];
  readonly isLoading: boolean;
} {
  const documentsQuery = useQuery({
    queryKey: queryKeys.documents.all(),
    queryFn: () => documentApi.list(),
    staleTime: STALE_TIMES.DOCUMENT_LIST,
    gcTime: GC_TIMES.DOCUMENT_LIST,
  });

  const resumesQuery = useQuery({
    queryKey: queryKeys.resumes.all(),
    queryFn: () => resumeApi.list(),
    staleTime: STALE_TIMES.RESUME_LIST,
    gcTime: GC_TIMES.RESUME_LIST,
  });

  const items = useMemo(() => {
    const resumeItems = (resumesQuery.data?.data ?? []).map((resume) => ({
      id: resume.id,
      title: resume.title,
      category: 'Resume',
      lastModified: new Date(resume.updatedAt),
      link: `/resume-builder?id=${resume.id}`,
    }));

    const documentItems = (documentsQuery.data?.data ?? []).map((document) => ({
      id: document.id,
      title: document.title,
      category: document.type.replace('_', ' '),
      lastModified: new Date(document.updatedAt),
      link: `/documents/${document.id}`,
    }));

    return [...resumeItems, ...documentItems].sort(
      (leftItem, rightItem) => rightItem.lastModified.getTime() - leftItem.lastModified.getTime()
    );
  }, [documentsQuery.data?.data, resumesQuery.data?.data]);

  return {
    items,
    isLoading: documentsQuery.isLoading || resumesQuery.isLoading,
  };
}
