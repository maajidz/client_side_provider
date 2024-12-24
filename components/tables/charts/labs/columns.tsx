"use client";
import { ColumnDef } from "@tanstack/react-table";
// import { UserData } from "@/types/userInterface";
import { Checkbox } from "@/components/ui/checkbox";

export interface LabResultsInterface {
  id: string;
  test: string;
  lab: string;
  date: string;
  interpretation: string;
}

export const columns = (): ColumnDef<LabResultsInterface>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => {
          row.toggleSelected(!!value);
        }}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "test",
    header: "Test",
  },
  {
    accessorKey: "lab",
    header: "lab",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "interpretation",
    header: "Interpretation",
    cell: ({ row }) => (
      <span
        className={
          row.original.interpretation === "Abnormal"
            ? "text-red-500 font-semibold"
            : "text-green-500 font-semibold"
        }
      >
        {row.original.interpretation}
      </span>
    ),
  },
];
