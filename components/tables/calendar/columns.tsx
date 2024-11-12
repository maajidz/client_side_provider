'use client';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { AvailabilityData } from '@/types/calendarInterface';

export const columns = (): ColumnDef<AvailabilityData>[] => [
  {
    accessorKey: 'date',
    header: 'Date',
    enableSorting: true,
    sortingFn: (a, b) =>
      new Date(a.original.date).getTime() - new Date(b.original.date).getTime(),
    cell: ({ row, table }) => {
      const isFirstRow =
        row.index === 0 || row.original.date !== table.getRowModel().rows[row.index - 1]?.original.date;
      return isFirstRow ? row.original.date : '';
    },
  },
  {
    accessorKey: 'slots',
    header: 'Time Slots',
    cell: ({ row }) => (
      row.original.slots.map((slot) =>
        <Badge className='bg-white border-[#84012A] border-2 text-[#84012A] hover:bg-white m-1' key={slot.id}>
          <div className='flex flex-row'>
            <div className='bg-white  text-[#84012A] '>{slot.startTime}</div> -
            <div className='bg-white text-[#84012A] '>{slot.endTime}</div>
          </div>
        </Badge>
      )
    )
  },
  {
    accessorKey: 'id',
    header: 'ID'
  },
];
