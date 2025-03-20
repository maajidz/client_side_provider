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
    const handleWrapperClick = () => {
      // Toggle the checkbox state when the wrapper is clicked
      if (onCheckedChange) {
        onCheckedChange(!checked);
      }
    };

    return (
      <TooltipProvider delayDuration={10}>
        <Tooltip>
          <TooltipTrigger>
            <div 
            className="flex gap-2 items-center justify-center cursor-pointer hover:bg-gray-100 rounded-md p-2" 
            onClick={handleWrapperClick}
          >
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
              <label className="flex font-medium cursor-pointer justify-center select-none">
                {label}
              </label>
            )}
          </div>
        </TooltipTrigger>
        {tooltipLabel && (
          <TooltipContent>
            {tooltipLabel}
          </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  }
);
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
