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
<<<<<<< HEAD
      className={cn(`relative flex-none duration-500 text-gray-600  overflow-y-scroll`, className)}
=======
      className={cn(`relative flex-none duration-500 text-gray-600 max-h-[calc(100vh-15rem)] overflow-y-scroll`, className)}
>>>>>>> 5c353e5 (Added UI Styles - Badges, Indicators and Misc fixes)
    >
      <div className="flex pr-4 flex-col gap-1 overflow-y-scroll">
        <PatientNav items={items} />
      </div>
    </aside>
  );
}
