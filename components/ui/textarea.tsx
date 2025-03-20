import * as React from "react"

import { cn } from "@/lib/utils"

const BaseTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex w-full transition-all rounded-md border border-input bg-white resize-none px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-[#E9DFE9] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:bg-[#F3EFF0]",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
BaseTextarea.displayName = "BaseTextarea"

// Memoized version to prevent unnecessary re-renders
const Textarea = React.memo(BaseTextarea, (prevProps, nextProps) => {
  // Only re-render if value or className changes
  return (
    prevProps.value === nextProps.value &&
    prevProps.className === nextProps.className
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
