"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { PastDiagnosesInterface } from "@/types/chartsInterface";

export const columns = (
  handleRowSelection: (row: PastDiagnosesInterface, isSelected: boolean) => void
): ColumnDef<PastDiagnosesInterface>[] => [
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
          handleRowSelection(row.original, !!value);
        }}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "diagnosis_name",
    header: "Title",
    cell: ({ row }) => <div>{row.original.type.diagnosis_name}</div>,
  },
  {
    accessorKey: "ICD_Code",
    header: "ICD Code",
    cell: ({ row }) => <div>{row.original.type.ICD_Code}</div>,
  },
];
