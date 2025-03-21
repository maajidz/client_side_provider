"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type Option = {
  id: string;
  label: string;
};

interface MultiSelectCheckboxProps {
  options: Option[];
  onChange?: (selectedOptions: string[]) => void;
  defaultSelected?: string[];
  label?: string;
  className?: string;
  displayMode?: "dropdown" | "upfront";
}

export function MultiSelectCheckbox({
  options,
  onChange,
  defaultSelected = [],
  label,
  className,
  displayMode = "dropdown",
}: MultiSelectCheckboxProps) {
  const [selectedOptions, setSelectedOptions] =
    React.useState<string[]>(defaultSelected);
  const [open, setOpen] = React.useState(false);

  const handleOptionChange = (optionId: string, checked: boolean) => {
    const newSelectedOptions = checked
      ? [...selectedOptions, optionId]
      : selectedOptions.filter((id) => id !== optionId);

    setSelectedOptions(newSelectedOptions);
    onChange?.(newSelectedOptions);
  };

  // Get the labels of selected options
  const getSelectedLabels = () => {
    return selectedOptions.map(
      (id) => options.find((option) => option.id === id)?.label || ""
    );
  };

  // Display logic for the trigger
  const renderSelectedOptions = () => {
    const selectedLabels = getSelectedLabels();

    if (selectedLabels.length === 0) {
      return <span className="text-muted-foreground">Select options</span>;
    }

    if (selectedLabels.length <= 2) {
      return selectedLabels.join(", ");
    }

    return (
      <div className="flex items-center gap-2">
        <span className="truncate">
          {selectedLabels.slice(0, 2).join(", ")}
        </span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="secondary" className="ml-1 cursor-help">
                +{selectedLabels.length - 2}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <div className="max-w-xs">
                <p className="font-medium mb-1">Additional selections:</p>
                <ul className="list-disc pl-4 space-y-1">
                  {selectedLabels.slice(2).map((label, index) => (
                    <li key={index} className="text-xs font-semibold">
                      {label}
                    </li>
                  ))}
                </ul>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  };

  // Render options list
  const renderOptionsList = () => (
    <div className="space-y-1">
      {options.map((option) => (
        <div
          key={option.id}
          className="flex items-center space-x-2 rounded-md hover:bg-muted/50"
        >
          <Checkbox
            id={`${option.id}-${displayMode}`}
            checked={selectedOptions.includes(option.id)}
            onCheckedChange={(checked) =>
              handleOptionChange(option.id, checked as boolean)
            }
          />
          <Label
            htmlFor={`${option.id}-${displayMode}`}
            className="flex-1 cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {option.label}
          </Label>
        </div>
      ))}
    </div>
  );

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && <label>{label}</label>}
      {displayMode === "dropdown" ? (
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between font-normal"
            >
              <div className="flex-1 text-left overflow-hidden">
                {renderSelectedOptions()}
              </div>
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
            {renderOptionsList()}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="space-y-3">
          <div className="flex min-h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
            <div className="flex-1 overflow-hidden">
              {renderSelectedOptions()}
            </div>
          </div>
          <div className="rounded-md border p-2">{renderOptionsList()}</div>
        </div>
      )}
    </div>
  );
}
