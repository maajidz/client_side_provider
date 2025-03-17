"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { formatDateDifference } from "@/utils/utils";

/**
 * * Mock Interface
 */
export interface PrescriptionTableInterface {
  patient: string;
  provider: string;
  visitType: string;
  visitDate: string;
  rxStatus: "Signed" | "Un-Signed";
  rxDetails: string;
  fromDate: string;
  toDate: string;
}

export const columns = (): ColumnDef<PrescriptionTableInterface>[] => [
  {
    accessorKey: "patient",
    header: "Patient",
    enableSorting: true,
  },
  {
    accessorKey: "provider",
    header: "Provider",
    enableSorting: true,
  },
  {
    accessorKey: "visitType",
    header: "Visit Type",
  },
  {
    accessorKey: "visitDate",
    header: "Visit Date",
    cell: ({ row }) => {
      const date = new Date(row.original.visitDate);
      return date.toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });
    },
  },
  {
    accessorKey: "rxDetails",
    header: "Rx Details",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col gap-1">
          <div>{row.original.rxDetails}</div>
          <div className="text-xs font-medium text-gray-500">
            {formatDateDifference(row.original.fromDate, row.original.toDate)}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "rxStatus",
    header: "Rx Status",
    cell: ({ row }) => {
      return (
        <Badge
          className="font-medium"
          variant={
            row.original.rxStatus === "Signed"
              ? "success"
              : "warning"
          }
        >
          {row.original.rxStatus}
        </Badge>
      );
    },
  },
];

