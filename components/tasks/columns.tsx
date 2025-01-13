"use client";

import { TasksResponseDataInterface } from "@/types/tasksInterface";
import { ColumnDef } from "@tanstack/react-table";

export const columns = (): ColumnDef<TasksResponseDataInterface>[] => [
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
        const assignedProviderId = row.getValue("assignedProvider") as TasksResponseDataInterface["assignedProvider"];
        return (
          <div className="cursor-pointer">
            {assignedProviderId.id}
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
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("status")}</div>
    ),
  }
];
