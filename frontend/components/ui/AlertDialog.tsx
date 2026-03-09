import React from 'react'

export const AlertDialog = ({ children }: { children: React.ReactNode }) => <div>{children}</div>
export const AlertDialogTrigger = ({ children }: { children: React.ReactNode }) => <div>{children}</div>
export const AlertDialogContent = ({ children }: { children: React.ReactNode }) => <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">{children}</div>
export const AlertDialogHeader = ({ children }: { children: React.ReactNode }) => <div>{children}</div>
export const AlertDialogFooter = ({ children }: { children: React.ReactNode }) => <div>{children}</div>
export const AlertDialogTitle = ({ children }: { children: React.ReactNode }) => <h2 className="text-xl font-bold">{children}</h2>
export const AlertDialogDescription = ({ children }: { children: React.ReactNode }) => <p>{children}</p>
export const AlertDialogAction = ({ children, onClick }: { children: React.ReactNode, onClick?: () => void }) => <button onClick={onClick}>{children}</button>
export const AlertDialogCancel = ({ children }: { children: React.ReactNode }) => <button>{children}</button>
