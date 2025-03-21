"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ProgressCircularProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-8 h-8",
  lg: "w-12 h-12",
};

const strokeClasses = {
  sm: "stroke-[4]",
  md: "stroke-[3]",
  lg: "stroke-[2]",
};

export function ProgressCircular({
  value = 0,
  size = "md",
  className,
  ...props
}: ProgressCircularProps) {
  const circumference = 2 * Math.PI * 45; // r = 45
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <svg className="w-full h-full -rotate-90">
        <circle
          className="text-muted-foreground/20"
          cx="50%"
          cy="50%"
          r="45%"
          fill="none"
          strokeWidth={strokeClasses[size]}
        />
        <circle
          className="text-primary transition-all duration-300 ease-in-out"
          cx="50%"
          cy="50%"
          r="45%"
          fill="none"
          strokeWidth={strokeClasses[size]}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}