"use client";
import { ColumnDef } from "@tanstack/react-table";
import { UserData } from "@/types/userInterface";

export const columns = (
  handleRowClick: (id: string) => void
): ColumnDef<UserData>[] => [
  {
    accessorKey: "patientId",
    header: "Patient ID",
    cell: ({ row }) => (
      <div
        className="cursor-pointer"
        onClick={() => handleRowClick(row.original.id)}
      >
        {row.getValue("patientId")}
      </div>
    ),
  },
  {
    accessorKey: "user",
    header: "Name",
    cell: ({ row }) => {
      const user = row.getValue("user") as UserData["user"];
      return (
        <div
          className="cursor-pointer capitalize"
          onClick={() => handleRowClick(row.original.id)}
        >
          {user?.firstName} {user?.lastName}
        </div>
      );
    },
  },
  {
    accessorKey: "dob",
    header: "Date of Birth",
    cell: ({ getValue, row }) => {
      const dob = getValue() as string;
      const date = new Date(dob);
      return (
        <div
          className="cursor-pointer"
          onClick={() => handleRowClick(row.original.id)}
        >
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
    accessorKey: "phoneNumber",
    header: "Phone Number",
    cell: ({ row }) => {
      const user = row.getValue("user") as UserData["user"];
      return (
        <div
          className="cursor-pointer"
          onClick={() => handleRowClick(row.original.id)}
        >
          {user?.phoneNumber}
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const user = row.getValue("user") as UserData["user"];
      return (
        <div
          className="cursor-pointer"
          onClick={() => handleRowClick(row.original.id)}
        >
          {user?.email}
        </div>
      );
    },
  },
];
