import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { UserPharmacyInterface } from "@/types/pharmacyInterface";
import {  Trash2Icon } from "lucide-react";

export const columns = (
  handleDelete: (pharmacyId: string) => Promise<void>
): ColumnDef<UserPharmacyInterface>[] => [
  {
    id: "name",
    accessorKey: "name",
    header: "Pharmacy Name",

    enableSorting: true,
  },
  {
    id: "address",
    accessorKey: "address",
    header: "Address",
  },
  {
    id: "phoneNumber",
    accessorKey: "phoneNumber",
    header: "Phone No.",
  },
  {
    id: "action",
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      const rowData = row.original;

      return (
        <Button
          variant="ghost"
          onClick={() => handleDelete(rowData.id)}
        >
          <Trash2Icon color="#84012A" />
        </Button>
      );
    },
  },
];

