'use client';
import { ColumnDef } from '@tanstack/react-table';
import { Payment } from '@/types/userInterface';
import { Badge } from '@/components/ui/badge';

export const columns = (): ColumnDef<Payment>[] => [
  {
    accessorKey: 'type',
    header: 'Type'
  },
  {
    id:'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge className='bg-white border-[#84012A] border-2 text-[#84012A] hover:bg-white'>{row.original.status}</Badge>
    )
  },
  {
    accessorKey: 'orderItem',
    header: 'Order Item'
  },
  {
    accessorKey: 'additonalItemDetails',
    header: 'Additonal item details'
  },
];
