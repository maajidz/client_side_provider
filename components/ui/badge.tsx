import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "",
  {
    variants: {
      variant: {
        default:
          "inline-flex items-center rounded-2xl bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-500/10 ring-inset",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "inline-flex items-center rounded-2xl bg-red-50 px-2 py-1 text-xs font-medium text-rose-900 ring-1 ring-red-600/10 ring-inset",
        outline: "text-foreground",
        ghost: "bg-white border-0 hover:bg-gray-100 hover:text-gray-800",
        blue:"inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset",
        indigo:"inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-700/10 ring-inset",
        purple:"inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-purple-700/10 ring-inset",
        pink:"inline-flex items-center rounded-md bg-pink-50 px-2 py-1 text-xs font-medium text-pink-700 ring-1 ring-pink-700/10 ring-inset",
        warning: "inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-yellow-600/20 ring-inset",
        success: "inline-flex items-center rounded-2xl bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ElementType;
}

function Badge({ className, variant, icon: Icon, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), "capitalize w-fit h-fit inline-flex flex-row items-center gap-1 rounded-2xl px-2 py-1 text-xs font-medium hover:cursor-pointer", className)} {...props}>
      {Icon && <Icon className="mr-1 w-3 h-3" />}
      {children}
    </span>
  )
}

export { Badge, badgeVariants }