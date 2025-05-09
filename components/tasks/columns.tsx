"use client";

import { Status, TasksResponseDataInterface, TaskTypeList } from "@/types/tasksInterface";
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
import { EllipsisVertical } from "lucide-react";
import { Badge } from "../ui/badge";

const handleTasksDelete = async (
  taskId: string,
  setTaskLoading: (loading: boolean) => void,
  showToast: (args: { type: "success" | "error"; message: string }) => void,
  fetchTasks: () => void
) => {
  setTaskLoading(true);
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
    setTaskLoading(false);
    fetchTasks();
  }
};

const handleTasksStatusUpdate = async (
  taskId: string,
  setTaskLoading: (loading: boolean) => void,
  showToast: (args: { type: "success" | "error"; message: string }) => void,
  fetchTasks: () => void
) => {
  setTaskLoading(true);
  try {
    const requestData: Status = {
      status: "COMPLETED",
    };
    await updateTaskStatus({ id: taskId, requestData });
    showToast({
      type: "success",
      message: "Task updated successfully",
    });
    fetchTasks();
  } catch (error) {
    console.error("Error:", error);
    showToast({ type: "error", message: "Failed to update task" });
  } finally {
    setTaskLoading(false);
  }
};

const priorityBadgeVariants: Record<string, "default" | "warning" | "destructive"> = {
  low: "default",      
  medium: "warning",   
  high: "destructive", 
};

export const columns = ({
  setEditData,
  setIsEditDialogOpen,
  setTaskLoading,
  showToast,
  fetchTasksList,
  setIsCommentDialogOpen,
  isPatientTask,
  taskTypes,
}: {
  setEditData: (data: TasksResponseDataInterface | null) => void;
  setIsEditDialogOpen: (isOpen: boolean) => void;
  setIsCommentDialogOpen: (isOpen: boolean) => void;
  setTaskLoading: (loading: boolean) => void;
  showToast: (args: { type: "success" | "error"; message: string }) => void;
  fetchTasksList: () => void;
  isPatientTask: boolean;
  taskTypes?: TaskTypeList[]
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
    cell: ({ row }) => {
      const priorityValue = row.getValue("priority") as keyof typeof priorityBadgeVariants;
      return (
        <Badge variant={priorityBadgeVariants[priorityValue] || "default"} showIndicator>
          {priorityValue}
        </Badge>
      );
    },
  },
  {
    accessorKey: "patientId",
    header: "Patient",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("patientId")}</div>
    ),
  },
  {
    accessorKey: "assignedProvider",
    header: "Assigned By",
    cell: ({ row }) => {
      const assignedProviderId = row.getValue(
        "assignedProvider"
      ) as TasksResponseDataInterface["assignedProvider"];
      return (
        <div className="cursor-pointer">
          {assignedProviderId?.providerUniqueId}
        </div>
      );
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
    cell: ({ row }) => {
      const statusColor =
        row.original.status === "COMPLETED" ? "success" : "warning";
      return <Badge variant={`${statusColor}`} >{row.original.status}</Badge>;
    },
  },
  {
    accessorKey: "id",
    header: "",
    cell: ({ row }) => (
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <EllipsisVertical size={16} className="text-gray-500"/>
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
                {row.original.description ? "Edit comment": "Add comment"}
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => {
                setEditData(row.original);
                setIsEditDialogOpen(true);
              }}
            >
              Edit Task
            </DropdownMenuItem>
            {row.original.status === "PENDING" && (
              <DropdownMenuItem
                onClick={() => {
                  handleTasksStatusUpdate(
                    row.original.id,
                    setTaskLoading,
                    showToast,
                    fetchTasksList
                  );
                }}
              >
                Mark as completed
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => {
                handleTasksDelete(
                  row.original.id,
                  setTaskLoading,
                  showToast,
                  fetchTasksList
                );
              }}
            >
              Delete
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => generateTasksPDF({ tasksData: row.original, taskType: taskTypes?.find((task) => task.id === row.original.categoryId)?.name || '' })}
            >
              Print
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
