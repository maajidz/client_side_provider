"use client";
import TasksDialog from "@/components/charts/Encounters/Details/Tasks/TasksDialog";
import { PlusIcon } from "lucide-react";
import React, { useState } from "react";
import { Heading } from "@/components/ui/heading";
import ViewPatientTasks from "./ViewPatientTasks";
import { Button } from "@/components/ui/button";

const PatientTasks = ({ userDetailsId }: { userDetailsId: string }) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <>
      <div className="flex">
        <div className="flex flex-1 justify-between items-center">
          <Heading title="Tasks" />
          <Button
            onClick={() => {
              setIsDialogOpen(true);
            }}
          >
          <PlusIcon />
          New Task
          </Button>
        </div>
        <TasksDialog
          userDetailsId={userDetailsId}
          onClose={handleDialogClose}
          isOpen={isDialogOpen}
        />
      </div>
      <ViewPatientTasks
        userDetailsId={userDetailsId}
        refreshTrigger={refreshTrigger}
      />
    </>
  );
};

export default PatientTasks;
// add => ghost plus. blue-600
