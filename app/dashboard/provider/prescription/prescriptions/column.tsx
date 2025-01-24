"use client";

import { ColumnDef } from "@tanstack/react-table";

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
  },
  {
    accessorKey: "fromDate",
    header: "From Date",

    enableSorting: true,
  },
  {
    accessorKey: "toDate",
    header: "To Date",

    enableSorting: true,
  },
  {
    accessorKey: "rxDetails",
    header: "Rx Details",
  },
  {
    accessorKey: "rxStatus",
    header: "Rx Status",
    cell: ({ row }) => {
      return (
        <span
          className={
            row.original.rxStatus === "Signed"
              ? "text-green-500 font-semibold"
              : "text-red-500 font-semibold"
          }
        >
          {row.original.rxStatus}
        </span>
      );
    },
  },
];

