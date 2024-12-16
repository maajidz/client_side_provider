'use client';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { PastDiagnosesInterface } from '@/types/chartsInterface';

export const columns = (handleRowSelection: (row: PastDiagnosesInterface, isSelected: boolean) => void): ColumnDef<PastDiagnosesInterface>[] => [
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
          row.toggleSelected(!!value)
          handleRowSelection(row.original, !!value);
        }}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'diagnosis_name',
    header: 'Title',
  },
  {
    accessorKey: 'ICD_Code',
    header: 'ICD Code',
  },
];
