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
            <div className="flex gap-2">
              <PlusIcon /> Add Task
            </div>
          </DefaultButton>
          <TasksDialog
            tasksData={editData}
            onClose={() => {
              setIsDialogOpen(false);
            }}
            isOpen={isDialogOpen}
          />
        </div>
        <ViewTasks />
      </div>
    </PageContainer>
  );
};

export default Tasks;
