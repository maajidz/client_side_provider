"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  label?: string | React.ReactNode;
  onCheckedChange?: (checked: boolean) => void;
  checked?: boolean;
  tooltipLabel?: string;
}

const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  ({ className, label, onCheckedChange, checked, tooltipLabel, ...props }, ref) => {
    const checkbox = (
      <div className="flex gap-2 items-center cursor-pointer hover:bg-gray-100 rounded-md p-2">
        <CheckboxPrimitive.Root
          ref={ref}
          checked={checked}
          onCheckedChange={onCheckedChange}
          className={cn(
            "peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
            className
          )}
          {...props}
        >
          <CheckboxPrimitive.Indicator
            className={cn("flex items-center justify-center text-current")}
          >
            <CheckIcon className="h-4 w-4" />
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
        {label && (
          <label 
            className="flex font-medium cursor-pointer justify-center select-none"
            onClick={(e) => {

              e.stopPropagation();
              if (onCheckedChange) {
                onCheckedChange(!checked);
              }
            }}
          >
            {label}
          </label>
        )}
      </div>
    );

    // Only wrap in tooltip if tooltipLabel is provided
    if (!tooltipLabel) {
      return checkbox;
    }

    return (
      <TooltipProvider delayDuration={10}>
        <Tooltip>
          <TooltipTrigger asChild>
            {checkbox}
          </TooltipTrigger>
          <TooltipContent>
            {tooltipLabel}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
);
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };