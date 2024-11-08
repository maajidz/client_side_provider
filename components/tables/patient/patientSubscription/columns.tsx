'use client';
import { ColumnDef } from '@tanstack/react-table';
import { Subscription } from '@/types/userInterface';
import { Badge } from '@/components/ui/badge';

export const columns = (): ColumnDef<Subscription>[] => [
  {
    accessorKey: 'startDate',
    header: 'Start Date'
  },
  {
    accessorKey: 'endDate',
    header: 'End Date'
  },
  {
    accessorKey: 'amount',
    header: 'Amount'
  },
  {
    accessorKey: 'subscriptionType',
    header: 'Subscription Type'
  },
  {
    id: 'status',
    header: 'Status',
    cell: ({ row }) => <Badge className='bg-white text-black border-black'>{row.original.status}</Badge>
  }
  // {
  //   accessorKey: 'status',
  //   header: 'Status'
  // },
  // {
  //   id: 'actions',
  //  cell: ({ row }) => <CellAction
  //     data={row.original}
  //   />
  // }
];
