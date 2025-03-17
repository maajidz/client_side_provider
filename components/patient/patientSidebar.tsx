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
      className={cn(`relative flex-none duration-500 text-gray-600 overflow-y-scroll scrollbar-thin scrollbar-thumb-pink-300/40 scrollbar-corner-rounded-full scrollbar-track-rounded-full scrollbar-thumb-rounded-full scrollbar-track-rose-50 h-[calc(100dvh-18rem)] hover:scrollbar-thumb-pink-300/50 active:scrollbar-thumb-pink-300/30`, className)}
    >
      <div className="flex pr-4 flex-col gap-1 scrollbar-track-">
        <PatientNav items={items} />
      </div>
    </aside>
  );
}
