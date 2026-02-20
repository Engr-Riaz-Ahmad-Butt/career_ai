"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface AccordionContextValue {
    value?: string | string[]
    onValueChange: (value: string) => void
    type: "single" | "multiple"
}

const AccordionContext = React.createContext<AccordionContextValue | undefined>(undefined)

export const Accordion = ({
    children,
    type = "single",
    defaultValue,
    className
}: {
    children: React.ReactNode,
    type?: "single" | "multiple",
    collapsible?: boolean,
    defaultValue?: string,
    className?: string
}) => {
    const [value, setValue] = React.useState<string | undefined>(defaultValue)

    const handleValueChange = (newValue: string) => {
        if (type === "single") {
            setValue(value === newValue ? undefined : newValue)
        }
    }

    return (
        <AccordionContext.Provider value={{ value, onValueChange: handleValueChange, type }}>
            <div className={cn("space-y-1", className)}>{children}</div>
        </AccordionContext.Provider>
    )
}

const BaseAccordionItem = ({
    value,
    children,
    className
}: {
    value: string,
    children: React.ReactNode,
    className?: string
}) => {
    return (
        <div className={cn("border-b dark:border-slate-800", className)} data-value={value}>
            {children}
        </div>
    )
}

export const AccordionTrigger = ({
    children,
    className
}: {
    children: React.ReactNode,
    className?: string
}) => {
    const context = React.useContext(AccordionContext)
    const itemValue = (React.useContext(AccordionItemContext) as any)?.value
    const isOpen = context?.value === itemValue

    return (
        <button
            onClick={() => context?.onValueChange(itemValue)}
            className={cn(
                "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline w-full text-left",
                className
            )}
        >
            {children}
            <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform duration-200", {
                "rotate-180": isOpen
            })} />
        </button>
    )
}

// Internal context to pass value down from Item to Trigger/Content
const AccordionItemContext = React.createContext<{ value: string } | undefined>(undefined)

const AccordionItemProvider = ({ value, children }: { value: string, children: React.ReactNode }) => (
    <AccordionItemContext.Provider value={{ value }}>
        {children}
    </AccordionItemContext.Provider>
)

// Wrap AccordionItem to provide context
export const AccordionItem = ({
    value,
    children,
    className
}: {
    value: string,
    children: React.ReactNode,
    className?: string
}) => (
    <AccordionItemProvider value={value}>
        <BaseAccordionItem value={value} className={className}>{children}</BaseAccordionItem>
    </AccordionItemProvider>
)

export const AccordionContent = ({
    children,
    className
}: {
    children: React.ReactNode,
    className?: string
}) => {
    const context = React.useContext(AccordionContext)
    const itemValue = (React.useContext(AccordionItemContext) as any)?.value
    const isOpen = context?.value === itemValue

    return (
        <AnimatePresence initial={false}>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden text-sm"
                >
                    <div className={cn("pb-4 pt-0", className)}>{children}</div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
