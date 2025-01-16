"use client";
import TasksDialog from "@/components/charts/Encounters/Details/Tasks/TasksDialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import React, { useState } from "react";
import ViewPatientTasks from "./ViewPatientTasks";

const PatientTasks = ({ userDetailsId }: { userDetailsId: string }) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  return (
    <>
      <div className="flex justify-end">
        <Button
          className="bg-[#84012A]"
          onClick={() => {
            setIsDialogOpen(true);
          }}
        >
          <div className="flex gap-2">
            <PlusIcon />
            Tasks
          </div>
        </Button>
        <TasksDialog
          userDetailsId={userDetailsId}
          onClose={() => {
            setIsDialogOpen(false);
          }}
          isOpen={isDialogOpen}
        />
      </div>
      <ViewPatientTasks userDetailsId={userDetailsId} />
    </>
  );
};

export default PatientTasks;
