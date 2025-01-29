"use client";
import React from "react";
import { patientItems } from "@/constants/data";
import { PatientNav } from "./patientNav";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";

type patientSidebarProps = {
  className?: string;
  userDetailsId: string;
};

export default function PatientSidebar({
  className,
  userDetailsId,
}: patientSidebarProps) {
  const items = patientItems(userDetailsId);

  return (
    <aside
      className={cn(
        `relative flex-none transition-[width] duration-500 my-1 rounded-r-md bg-[#84012A]`,
        className
      )}
    >
      <>
        <div className="h-5"></div>
        <ScrollArea className="h-[75vh] w-48 ">
          <div className="p-4">
            <PatientNav items={items} />
          </div>
        </ScrollArea>
      </>
    </aside>
  );
}
