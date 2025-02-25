"use client";
import React from "react";
import { patientItems } from "@/constants/data";
import { PatientNav } from "./patientNav";
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
        `relative flex-none duration-500 text-gray-600`,
        className
      )}
    >
      <>
        <div className="h-[70dvh] flex pr-4 flex-1 flex-grow overflow-auto">
            <PatientNav items={items} />
        </div>
      </>
    </aside>
  );
}
