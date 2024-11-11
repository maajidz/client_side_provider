'use client';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { AvailabilityData } from '@/types/calendarInterface';

export const columns = (): ColumnDef<AvailabilityData>[] => [
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'date',
    header: 'Date'
  },
  {
    id: 'isAvailable',
    header: 'is Available',
    // cell: ({ row }) => (
    //   <Badge className='bg-white border-[#84012A] border-2 text-[#84012A] hover:bg-white'>{row.original.status}</Badge>
    // )
  },
  {
    accessorKey: 'notes',
    header: 'Notes'
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
  }
];
