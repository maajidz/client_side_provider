import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "",
  {
    variants: {
      variant: {
        default:
          "inline-flex items-center rounded-2xl bg-gray-50 px-2 py-1 text-xs  text-gray-700 ring-1 ring-gray-500/10 ring-inset",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "inline-flex items-center rounded-2xl bg-red-50 px-2 py-1 text-xs  text-rose-900 ring-1 ring-red-600/10 ring-inset",
        outline: "text-foreground",
        ghost: "bg-white border-0 hover:bg-gray-100 hover:text-gray-800",
        blue:"inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs  text-blue-800 ring-1 ring-blue-700/10 ring-inset",
        indigo:"inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs  text-indigo-800 ring-1 ring-indigo-700/10 ring-inset",
        purple:"inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs  text-purple-800 ring-1 ring-purple-700/10 ring-inset",
        pink:"inline-flex items-center rounded-md bg-pink-50 px-2 py-1 text-xs  text-pink-700 ring-1 ring-pink-700/10 ring-inset",
        warning: "inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs  text-yellow-800 ring-1 ring-yellow-600/20 ring-inset",
        success: "inline-flex items-center rounded-2xl bg-green-50 px-2 py-1 text-xs  text-green-800 ring-1 ring-green-600/20 ring-inset",
        indicator: "inline-flex items-center rounded-2xl px-2 py-1 text-xs text-gray-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

// Define styles for indicators based on the variant
export const indicatorStylesMap: Record<string, string> = {
  default: "bg-gray-500",
  warning: "bg-yellow-500",
  destructive: "bg-red-500",
  success: "bg-green-500",
  blue: "bg-blue-500",
  indigo: "bg-indigo-500",
  purple: "bg-purple-500",
  pink: "bg-pink-500",
};

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ElementType;
  showIndicator?: boolean;
}

function Badge({ className, variant, icon: Icon, showIndicator, children, ...props }: BadgeProps) {
  const indicatorStyles = cn(
    "flex w-1.5 h-1.5 rounded-full",
    {
      [indicatorStylesMap[variant || "default"]]: true,
    }
  );

  // Set effective variant based on showIndicator for all variants
  const effectiveVariant = showIndicator ? "indicator" : variant;

  return (
    <span className={cn(badgeVariants({ variant: effectiveVariant }), "capitalize w-fit h-fit inline-flex flex-row items-center gap-1 rounded-2xl px-2 py-1 text-xs hover:cursor-pointer font-semibold", className)} {...props}>
      {showIndicator && <span className={indicatorStyles}></span>}
      {Icon && <Icon className="mr-1 w-3 h-3" />}
      {children}
    </span>
  )
}

export { Badge, badgeVariants }