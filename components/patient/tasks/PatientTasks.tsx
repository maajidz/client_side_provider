"use client";
// import TasksDialog from "@/components/charts/Encounters/Details/Tasks/TasksDialog";
import { PlusIcon } from "lucide-react";
import React, { useState } from "react";
import ViewPatientTasks from "./ViewPatientTasks";
import DefaultButton from "@/components/custom_buttons/buttons/DefaultButton";

const PatientTasks = ({ userDetailsId }: { userDetailsId: string }) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  console.log(isDialogOpen);

  return (
    <>
      <div className="flex justify-end mb-3">
        <DefaultButton
          onClick={() => {
            setIsDialogOpen(true);
          }}
        >
          <div className="flex gap-2 items-center">
            <PlusIcon />
            Tasks
          </div>
        </DefaultButton>
        {/* <TasksDialog
          userDetailsId={userDetailsId}
          onClose={() => {
            setIsDialogOpen(false);
          }}
          isOpen={isDialogOpen}
          onFetchTasks={() => {}}
        /> */}
      </div>
      <ViewPatientTasks userDetailsId={userDetailsId} />
    </>
  );
};

export default PatientTasks;
// add => ghost plus. blue-600