"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NavItem } from "@/types";
import { Dispatch, SetStateAction } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PatientNavProps {
  items: NavItem[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

export function PatientNav({ items, setOpen }: PatientNavProps) {
  const path = usePathname();
  if (!items?.length) {
    return null;
  }

  return (
    <TooltipProvider>
      {items.map((item, index) => {
        return (
          item.href && (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Link
                  href={item.disabled ? "/" : item.href}
                  className={cn(
                    "flex items-start flex-row rounded-md py-2 px-4 text-sm font-medium hover:bg-pink-50 hover:text-[#84012A]",
                    path === item.href
                      ? "bg-pink-50 text-[#84012A] font-semibold"
                      : "transparent",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                  onClick={() => {
                    if (setOpen) setOpen(false);
                  }}
                >
                  <span className="truncate">{item.title}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent
                align="center"
                side="right"
                sideOffset={8}
                className={ "inline-block"}
              >
                {item.title}
              </TooltipContent>
            </Tooltip>
          )
        );
      })}
    </TooltipProvider>
  );
}
