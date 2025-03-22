import * as React from "react"
import { useEffect, useRef, useState } from 'react';

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, 
  // ref
) => {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const [isRow, setIsRow] = useState(false);

  useEffect(() => {
    if (parentRef.current) {
      const computedStyle = window.getComputedStyle(parentRef.current);
      setIsRow(computedStyle.flexDirection === 'row');
    }
  }, [parentRef]);

  return (
    <div
      ref={parentRef}
      className={cn(
        "transition-all flex flex-col",
        isRow ? "flex-grow" : "",
        "items-start gap-3 rounded-xl border border-gray-300/50 hover:border-gray-300 hover:cursor-pointer bg-card text-card-foreground px-4 py-3 hover:shadow-sm",
        className
      )}
      {...props}
    />
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("font-semibold flex flex-1 capitalize", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-xs font-medium flex flex-1", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("pt-0 flex flex-1", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-0 text-xs  text-gray-500 font-medium", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
