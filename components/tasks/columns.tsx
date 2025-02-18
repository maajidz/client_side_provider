"use client";

import { Status, TasksResponseDataInterface } from "@/types/tasksInterface";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteTask, updateTaskStatus } from "@/services/chartDetailsServices";
import generateTasksPDF from "../patient/tasks/generateTasksPDF";
import { Ellipsis } from "lucide-react";

const handleTasksDelete = async (
  taskId: string,
  setLoading: (loading: boolean) => void,
  showToast: (args: { type: string; message: string }) => void,
  fetchTasks: () => void
) => {
  setLoading(true);
  try {
    await deleteTask({ id: taskId });
    showToast({
      type: "success",
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    showToast({ type: "error", message: "Failed to delete task" });
  } finally {
    setLoading(false);
    fetchTasks();
  }
};

const handleTasksStatusUpdate = async (
  taskId: string,
  setLoading: (loading: boolean) => void,
  showToast: (args: { type: string; message: string }) => void,
  fetchTasks: () => void
) => {
  setLoading(true);
  try {
    const requestData: Status = {
      status: "COMPLETED",
    };
    await updateTaskStatus({ id: taskId, requestData });
    showToast({
      type: "success",
      message: "Task deleted successfully",
    });
    fetchTasks();
  } catch (error) {
    console.error("Error:", error);
    showToast({ type: "error", message: "Failed to delete task" });
  } finally {
    setLoading(false);
  }
};

export const columns = ({
  setEditData,
  setIsDialogOpen,
  setLoading,
  showToast,
  fetchTasksList,
  setIsCommentDialogOpen,
  isPatientTask,
}: {
  setEditData: (data: TasksResponseDataInterface | null) => void;
  setIsDialogOpen: (isOpen: boolean) => void;
  setIsCommentDialogOpen: (isOpen: boolean) => void;
  setLoading: (loading: boolean) => void;
  showToast: (args: { type: string; message: string }) => void;
  fetchTasksList: () => void;
  isPatientTask: boolean;
}): ColumnDef<TasksResponseDataInterface>[] => [
  {
    accessorKey: "notes",
    header: "Task",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("notes")}</div>
    ),
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("priority")}</div>
    ),
  },
  {
    accessorKey: "userDetailsId",
    header: "Patient",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("userDetailsId")}</div>
    ),
  },
  {
    accessorKey: "assignedProvider",
    header: "Assigned By",
    cell: ({ row }) => {
      const assignedProviderId = row.getValue(
        "assignedProvider"
      ) as TasksResponseDataInterface["assignedProvider"];
      return <div className="cursor-pointer">{assignedProviderId?.id}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created On",
    cell: ({ getValue }) => {
      const dob = getValue() as string;
      const date = new Date(dob);
      return (
        <div className="cursor-pointer">
          {date.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    cell: ({ getValue }) => {
      const dob = getValue() as string;
      const date = new Date(dob);
      return (
        <div className="cursor-pointer">
          {date.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "id",
    header: "",
    cell: ({ row }) => (
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Ellipsis />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSeparator />
            {isPatientTask && (
              <DropdownMenuItem
                onClick={() => {
                  setEditData(row.original);
                  setIsCommentDialogOpen(true);
                }}
              >
                Add comment
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => {
                setEditData(row.original);
                setIsDialogOpen(true);
              }}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                handleTasksStatusUpdate(row.original.id, setLoading, showToast, fetchTasksList);
              }}
            >
              Mark as completed
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                handleTasksDelete(
                  row.original.id,
                  setLoading,
                  showToast,
                  fetchTasksList
                );
              }}
            >
              Delete
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => generateTasksPDF({ tasksData: row.original })}
            >
              Print
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
