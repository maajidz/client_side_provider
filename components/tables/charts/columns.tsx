'use client';
import { ColumnDef } from '@tanstack/react-table';
import { UserData } from '@/types/userInterface';

export const columns = (handleRowClick: (id: string) => void): ColumnDef<UserData>[] => [
  {
    accessorKey: 'lastName',
    header: 'Title',
    cell: ({ row }) => (
      <div className="cursor-pointer" onClick={() => handleRowClick(row.original.id)}>
        {row.getValue('lastName')}
      </div>
    ),
  },
  {
    accessorKey: 'firstName',
    header: 'Patient',
    cell: ({ row }) => (
      <div className="cursor-pointer" onClick={() => handleRowClick(row.original.id)}>
        {row.getValue('firstName')}
      </div>
    ),
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Record ID',
    cell: ({ row }) => (
      <div className="cursor-pointer" onClick={() => handleRowClick(row.original.id)}>
        {row.getValue('phoneNumber')}
      </div>
    ),
  },
  {
    accessorKey: 'dob',
    header: 'Date',
    cell: ({ getValue, row }) => {
      const dob = getValue() as string;
      const date = new Date(dob);
      return (
        <div className="cursor-pointer" onClick={() => handleRowClick(row.original.id)}>
          {date.toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
          })}
        </div>
      );
    }
  },
];
