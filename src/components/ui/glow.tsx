import React from "react";
import { cn } from "../../lib/utils";

interface GlowProps {
  className?: string;
  variant?: "top" | "bottom" | "both";
}

export function Glow({ className, variant = "top", ...props }: GlowProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-0 overflow-hidden",
        className
      )}
      {...props}
    >
      {(variant === "top" || variant === "both") && (
        <div
          className={cn(
            "absolute -top-40 left-1/2 z-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-primary/20 blur-[100px] filter",
            variant === "both" && "opacity-50"
          )}
        />
      )}
      {(variant === "bottom" || variant === "both") && (
        <div className="absolute -bottom-40 left-1/2 z-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-primary/20 blur-[100px] filter" />
      )}
    </div>
  );
} 