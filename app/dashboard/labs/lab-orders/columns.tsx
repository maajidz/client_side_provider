"use client";
import { ColumnDef } from "@tanstack/react-table";
import { LabOrdersInterface } from "@/types/chartsInterface";

export const columns = (): ColumnDef<LabOrdersInterface>[] => [
  {
    accessorKey: "userDetailsId",
    header: "Patient ID",

    enableSorting: true,
  },
  {
    accessorKey: "tests",
    header: "Tests",
  },
  {
    accessorKey: "labs",
    header: "Lab Ref",
  },
  {
    accessorKey: "orderedBy",
    header: "Ordered By",

    enableSorting: true,
  },
  {
    accessorKey: "date",
    header: "Ordered On",
  },
  {
    accessorKey: "isSigned",
    header: "Result Status",
    cell: ({ row }) => {
      return (
        <span
          className={
            !row.original.isSigned
              ? "text-yellow-500 font-semibold"
              : "text-green-500 font-semibold"
          }
        >
          {row.original.isSigned ? "Accepted" : "Pending"}
        </span>
      );
    },

    enableSorting: true,
  },
];

