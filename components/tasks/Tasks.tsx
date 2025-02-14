"use client";
import PageContainer from "@/components/layout/page-container";
import React, { useState } from "react";
import ViewTasks from "./ViewTasks";
import TasksDialog from "./TasksDialog";
import { PlusIcon } from "lucide-react";
import { TasksResponseDataInterface } from "@/types/tasksInterface";
import DefaultButton from "../custom_buttons/buttons/DefaultButton";

const Tasks = () => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [editData, setEditData] = useState<TasksResponseDataInterface | null>(
    null
  );
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <div className="flex flex-row justify-between gap-10">
          <div>Tasks</div>
          <DefaultButton
            onClick={() => {
              setEditData(null);
              setIsDialogOpen(true);
            }}
          >
            <PlusIcon /> Add Task
          </DefaultButton>
          <TasksDialog
            tasksData={editData}
            onClose={handleDialogClose}
            isOpen={isDialogOpen}
          />
        </div>
        <ViewTasks refreshTrigger={refreshTrigger}/>
      </div>
    </PageContainer>
  );
};

export default Tasks;
