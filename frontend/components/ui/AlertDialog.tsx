import React from 'react'

interface BaseProps {
  children: React.ReactNode;
}

interface DialogProps extends BaseProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface ActionProps extends BaseProps {
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
}

export const AlertDialog = ({ children }: DialogProps) => <div>{children}</div>
export const AlertDialogTrigger = ({ children }: BaseProps) => <div>{children}</div>
export const AlertDialogContent = ({ children }: BaseProps) => <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">{children}</div>
export const AlertDialogHeader = ({ children }: BaseProps) => <div>{children}</div>
export const AlertDialogFooter = ({ children }: BaseProps) => <div>{children}</div>
export const AlertDialogTitle = ({ children }: BaseProps) => <h2 className="text-xl font-bold">{children}</h2>
export const AlertDialogDescription = ({ children }: BaseProps) => <p>{children}</p>
export const AlertDialogAction = ({ children, onClick, className }: ActionProps) => <button onClick={onClick} className={className}>{children}</button>
export const AlertDialogCancel = ({ children, onClick }: ActionProps) => <button onClick={onClick}>{children}</button>
