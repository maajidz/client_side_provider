"use client";
import { ColumnDef } from "@tanstack/react-table";
// import { UserData } from "@/types/userInterface";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

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
    header: ({ table }) => {
      const isAllSelected = table.getIsAllPageRowsSelected();
      const isSomeSelected = table.getIsSomePageRowsSelected();
      
      return (
        <Checkbox
          checked={isAllSelected}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          tooltipLabel={isSomeSelected && !isAllSelected ? "Some items selected" : undefined}
        />
      );
    },
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
      <Badge
        variant={
          row.original.interpretation === "Abnormal"
            ? "destructive"
            : "success"
        }
      >
        {row.original.interpretation}
      </Badge>
    ),
  },
];
