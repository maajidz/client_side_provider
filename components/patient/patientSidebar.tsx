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
        `relative flex-none duration-500 bg-white text-gray-600`,
        className
      )}
    >
      <>
        <ScrollArea className="h-[75vh]">
          <div className="">
            <PatientNav items={items} />
          </div>
        </ScrollArea>
      </>
    </aside>
  );
}
