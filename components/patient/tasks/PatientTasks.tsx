"use client";
import TasksDialog from "@/components/charts/Encounters/Details/Tasks/TasksDialog";
import { PlusIcon } from "lucide-react";
import React, { useState } from "react";
import ViewPatientTasks from "./ViewPatientTasks";
import DefaultButton from "@/components/custom_buttons/buttons/DefaultButton";

const PatientTasks = ({ userDetailsId }: { userDetailsId: string }) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <>
      <div className="flex justify-end mb-3">
        <DefaultButton
          onClick={() => {
            setIsDialogOpen(true);
          }}
        >
            <PlusIcon />
            Tasks
        </DefaultButton>
        <TasksDialog
          userDetailsId={userDetailsId}
          onClose={handleDialogClose}
          isOpen={isDialogOpen}
        />
      </div>
      <ViewPatientTasks userDetailsId={userDetailsId} refreshTrigger={refreshTrigger} />
    </>
  );
};

export default PatientTasks;
// add => ghost plus. blue-600