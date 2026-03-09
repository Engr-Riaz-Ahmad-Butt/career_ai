/**
 * Simple modal/dialog state management hook
 * Eliminates repetitive useState patterns for modals
 */

import { useState, useCallback } from 'react';

export interface UseModalReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

/**
 * Hook for managing modal/dialog open/close state
 * 
 * @example
 * const modal = useModal();
 * 
 * <Button onClick={modal.open}>Open Dialog</Button>
 * <Dialog open={modal.isOpen} onClose={modal.close}>
 *   Content
 * </Dialog>
 */
export function useModal(initialOpen = false): UseModalReturn {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}
