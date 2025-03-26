import React from "react";
import { cn } from "../../lib/utils";

interface MockupProps {
  children: React.ReactNode;
  className?: string;
  type?: "responsive" | "browser" | "phone" | "desktop";
}

export function Mockup({
  children,
  className,
  type = "responsive",
  ...props
}: MockupProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border bg-background shadow-xl",
        className
      )}
      {...props}
    >
      {type === "browser" && (
        <div className="flex items-center gap-1 border-b bg-muted/50 px-4 py-3">
          <div className="h-2 w-2 rounded-full bg-muted-foreground/20"></div>
          <div className="h-2 w-2 rounded-full bg-muted-foreground/20"></div>
          <div className="h-2 w-2 rounded-full bg-muted-foreground/20"></div>
        </div>
      )}
      {type === "phone" && (
        <div className="px-4 py-10">
          <div className="mx-auto mb-2 h-2 w-16 rounded-full bg-muted-foreground/20"></div>
          {children}
          <div className="mx-auto mt-4 h-4 w-4 rounded-full border bg-muted-foreground/20"></div>
        </div>
      )}
      {(type === "responsive" || type === "desktop") && <>{children}</>}
    </div>
  );
}

interface MockupFrameProps {
  children: React.ReactNode;
  className?: string;
  size?: "small" | "medium" | "large";
}

export function MockupFrame({
  children,
  className,
  size = "medium",
  ...props
}: MockupFrameProps) {
  return (
    <div
      className={cn(
        "relative",
        size === "small" && "max-w-lg",
        size === "medium" && "max-w-2xl",
        size === "large" && "max-w-4xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
} 