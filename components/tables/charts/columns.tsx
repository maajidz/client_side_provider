'use client';
import { ColumnDef } from '@tanstack/react-table';
import { EncounterResponse } from '@/types/encounterInterface';
import { Button } from '@/components/ui/button';

export const columns = (
  handleRowClick: (id: string) => void
): ColumnDef<EncounterResponse | undefined>[] => [
  {
    accessorKey: "userDetails",
    header: "User Details",
    cell: ({ row }) => {
      const userDetails = row.original?.userDetails;
      return userDetails ? (
        <div
          className="cursor-pointer"
          onClick={() => handleRowClick(row.original!.id)}
        >
          {userDetails.patientId}
        </div>
      ) : null;
    },
  },
  {
    accessorKey: "visit_type",
    header: "Visit type",
    cell: ({ row }) => {
      const visitType = row.original?.visit_type;
      return visitType ? (
        <div
          className="cursor-pointer"
          onClick={() => handleRowClick(row.original!.id)}
        >
          {visitType}
        </div>
      ) : null;
    },
  },
  {
    accessorKey: "mode",
    header: "Mode",
    cell: ({ row }) => {
      const mode = row.original?.mode;
      return mode ? (
        <div
          className="cursor-pointer"
          onClick={() => handleRowClick(row.original!.id)}
        >
          {mode}
        </div>
      ) : null;
    },
  },
  {
    accessorKey: "isVerified",
    header: "Is Verified",
    cell: ({ row }) => {
      const { isVerified, id } = row.original || {};

      return (
        <div
          className="cursor-pointer"
          onClick={() => id && handleRowClick(id)}
        >
          {isVerified ? "True" : "False"}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Data",
    cell: ({ row }) => {
      const createdAt = row.original?.createdAt;
      return createdAt ? (
        <div
          className="cursor-pointer"
          onClick={() => handleRowClick(row.original!.id)}
        >
          {createdAt.split("T")[0]}
        </div>
      ) : null;
    },
  },
  {
    accessorKey: "id",
    header: "Id",
    cell: ({ row }) => {
      const id = row.original?.id;
      return id ? (
        <Button
          variant={"link"}
          className="text-blue-600 underline"
          onClick={() => handleRowClick(id)}
        >
          Open Encounter
        </Button>
      ) : null;
    },
  },
];
