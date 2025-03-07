import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
<<<<<<< HEAD
        "flex w-full transition-all font-medium rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-[#E9DFE9] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:bg-[#F3EFF0]",
=======
        "flex w-full transition-all rounded-md border border-input bg-white resize-none px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-[#E9DFE9] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:bg-[#F3EFF0]",
>>>>>>> 5c353e5 (Added UI Styles - Badges, Indicators and Misc fixes)
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
