'use client';
import { ColumnDef } from '@tanstack/react-table';
import { Medication } from '@/types/medicationInterface';

export const columns = (): ColumnDef<Medication>[] => [
  // {
  //   id:'status',
  //   header: 'Status',
  //   cell: ({ row }) => (
  //     <Badge className='bg-white border-[#84012A] border-2 text-[#84012A] hover:bg-white'>{row.original.status}</Badge>
  //   )
  // },
  {
    accessorKey: 'medicationType',
    header: 'Medication Type'
  },
  {
    accessorKey: 'medication',
    header: 'Medication'
  },
  {
    accessorKey: 'dosage',
    header: 'Dosage'
  },
  {
    accessorKey: 'supply',
    header: 'Supply'
  },
  {
    accessorKey: 'desiredMedicationType',
    header: 'Desired Medication Type'
  },
  {
    accessorKey: 'desiredMedication',
    header: 'Desired Medication'
  },
  {
    accessorKey: 'desiredDosage',
    header: 'Desired dosage'
  },
  {
    accessorKey: 'desiredSupply',
    header: 'Desired Supply'
  },
  {
    accessorKey: 'sideEffectsFromPreviousMedication',
    header: 'Side Effects'
  },
  {
    accessorKey: 'dateOfFinalDoseOfCurrentMedication',
    header: 'Final date of dosage'
  },
  // {
  //   accessorKey: 'weight4WeeksAgo',
  //   header: 'Weight 4 weeks ago'
  // },
  // {
  //   accessorKey: 'currentWeight',
  //   header: 'Current Weight'
  // },
];
