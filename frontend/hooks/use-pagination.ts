import { useState, useMemo, useCallback } from 'react';

export interface PaginationConfig {
  /**
   * Initial page (1-indexed)
   */
  initialPage?: number;
  
  /**
   * Items per page
   */
  pageSize?: number;
  
  /**
   * Total number of items
   */
  totalItems: number;
}

export interface UsePaginationReturn<T> {
  /**
   * Current page (1-indexed)
   */
  currentPage: number;
  
  /**
   * Total number of pages
   */
  totalPages: number;
  
  /**
   * Items for current page
   */
  pageData: T[];
  
  /**
   * Go to specific page
   */
  goToPage: (page: number) => void;
  
  /**
   * Go to next page
   */
  nextPage: () => void;
  
  /**
   * Go to previous page
   */
  prevPage: () => void;
  
  /**
   * Check if on first page
   */
  isFirstPage: boolean;
  
  /**
   * Check if on last page
   */
  isLastPage: boolean;
  
  /**
   * Range of current items (e.g., "1-10 of 50")
   */
  rangeText: string;
  
  /**
   * Reset to first page
   */
  reset: () => void;
}

/**
 * Hook for client-side pagination
 * Replaces repeated pagination logic
 * 
 * @example
 * ```tsx
 * const { pageData, currentPage, totalPages, nextPage, prevPage } = usePagination({
 *   data: allItems,
 *   pageSize: 10,
 *   totalItems: allItems.length,
 * });
 * ```
 */
export function usePagination<T>({
  initialPage = 1,
  pageSize = 10,
  totalItems,
}: PaginationConfig): UsePaginationReturn<T> & { data?: T[] } {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = useMemo(
    () => Math.ceil(totalItems / pageSize),
    [totalItems, pageSize]
  );

  const goToPage = useCallback(
    (page: number) => {
      const pageNumber = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(pageNumber);
    },
    [totalPages]
  );

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const reset = useCallback(() => {
    setCurrentPage(initialPage);
  }, [initialPage]);

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  
  const rangeText = totalItems === 0 
    ? '0 items'
    : `${startIndex + 1}-${endIndex} of ${totalItems}`;

  return {
    currentPage,
    totalPages,
    pageData: [], // Will be sliced from data array in component
    goToPage,
    nextPage,
    prevPage,
    isFirstPage,
    isLastPage,
    rangeText,
    reset,
  };
}

/**
 * Helper function to slice data for current page
 */
export function getPaginatedData<T>(
  data: T[],
  currentPage: number,
  pageSize: number
): T[] {
  const startIndex = (currentPage - 1) * pageSize;
  return data.slice(startIndex, startIndex + pageSize);
}
