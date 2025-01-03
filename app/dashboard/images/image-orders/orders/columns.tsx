"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ImageOrdersInterface } from "@/types/chartsInterface";

export const columns = (): ColumnDef<ImageOrdersInterface>[] => [
  {
    accessorKey: "id",
    header: "Patient ID",

    enableSorting: true,
  },
  {
    accessorKey: "imageTypeId",
    header: "Image Type ID",
  },
  {
    accessorKey: "imageTestIds",
    header: "Image Test ID",
  },
  {
    accessorKey: "note_to_patients",
    header: "Note to Patient",
  },
  {
    accessorKey: "intra_office_notes",
    header: "Intra Office Notes",
  },
  {
    accessorKey: "ordered_date",
    header: "Ordered On",
    cell: ({ row }) => {
      return (
        <span>{new Date(row.original.ordered_date).toLocaleDateString()}</span>
      );
    },
  },
];

