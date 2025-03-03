import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";

export interface eRxTableInterface {
  patient: string;
  provider: string;
  drug: string;
  pharmacy: string;
  type: string;
  status: "Confirmed" | "Pending";
}

export const columns = (): ColumnDef<eRxTableInterface>[] => [
  {
    accessorKey: "patient",
    header: "Patient",

    enableSorting: true,
  },
  {
    accessorKey: "provider",
    header: "Provider",

    enableSorting: true,
  },
  {
    accessorKey: "drug",
    header: "Drug",

    enableSorting: true,
  },
  {
    accessorKey: "pharmacy",
    header: "Pharmacy",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <Badge
          variant={
            row.original.status === "Confirmed"
              ? "success"
              : "default"
          }
        >
          {row.original.status}
        </Badge>
      );
    },
  },
];

