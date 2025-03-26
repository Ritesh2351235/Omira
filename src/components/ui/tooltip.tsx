"use client"

import * as React from "react"
import { cn } from "../../lib/utils"

interface TooltipProviderProps {
  children: React.ReactNode
}

const TooltipProvider: React.FC<TooltipProviderProps> = ({ children }) => {
  return <>{children}</>
}

interface TooltipProps {
  children: React.ReactNode
  className?: string
}

const Tooltip: React.FC<TooltipProps> = ({ children, className }) => {
  return <div className={cn("relative", className)}>{children}</div>
}

interface TooltipTriggerProps {
  children: React.ReactNode
  asChild?: boolean
}

const TooltipTrigger: React.FC<TooltipTriggerProps> = ({ children, asChild }) => {
  return <>{children}</>
}

interface TooltipContentProps {
  children: React.ReactNode
  className?: string
}

const TooltipContent: React.FC<TooltipContentProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
    >
      {children}
    </div>
  )
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } 