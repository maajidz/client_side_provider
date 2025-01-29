'use client';
import { ColumnDef } from '@tanstack/react-table';
import { UserAppointmentInterface } from '@/types/userInterface';
import JoinButton from './JoinButton';
import { Badge } from '@/components/ui/badge';

export const columns = (): ColumnDef<UserAppointmentInterface>[] => [
  {
    accessorKey: 'patientName',
    header: 'Patient Name'
  },
  {
    accessorKey: 'dateOfAppointment',
    header: 'Date of appointment'
  },
  {
    accessorKey: 'timeOfAppointment',
    header: 'Time of appointment'
  },
  {
    id:'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge className='bg-white border-[#84012A] border-2 text-[#84012A] hover:bg-white'>{row.original.status}</Badge>
    )
  },
  {
    accessorKey: 'providerName',
    header: 'Provider Name'
  },
  {
    accessorKey: 'specialization',
    header: 'Specialization'
  },
  {
    id: 'meetingLink',
    header: 'Meeting Link',
    cell: ({ row }) => (
      <JoinButton  appointmentLink={row.original.meetingLink}/>
    ),
    enableSorting: true
  },
  // {
  //   id: 'actions',
  //  cell: ({ row }) => <CellAction
  //     data={row.original}
  //   />
  // }
];
