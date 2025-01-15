"use client";
import { TransferResponseData } from "@/types/chartsInterface";
import { ColumnDef } from "@tanstack/react-table";

export const columns = (): ColumnDef<TransferResponseData>[] => [
  {
    accessorKey: "userDetailsID",
    header: "Patient ID",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("userDetailsID")}</div>
    ),
  },
  {
    accessorKey: "referringFromProviderID",
    header: "Referring from provider ID",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("referringFromProviderID")}</div>
    ),
  },
  {
    accessorKey: "referringToProviderID",
    header: "Referring to provider ID",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("referringToProviderID")}</div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
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
    accessorKey: "responseStatus",
    header: "Response Status",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("responseStatus")}</div>
    ),
  },
];
