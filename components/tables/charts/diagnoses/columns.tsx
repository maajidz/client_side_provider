'use client';
import { ColumnDef } from '@tanstack/react-table';
import { UserData } from '@/types/userInterface';
import { Checkbox } from '@/components/ui/checkbox';

export const columns = (handleRowSelection: (row: UserData, isSelected: boolean) => void): ColumnDef<UserData>[] => [
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
    accessorKey: 'lastName',
    header: 'Title',
  },
  {
    accessorKey: 'firstName',
    header: 'Patient',
  },
];
