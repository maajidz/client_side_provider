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
        <span
          className={
            row.original.status === "Confirmed"
              ? "text-green-500 font-semibold"
              : "text-yellow-500 font-semibold"
          }
        >
          {row.original.status}
        </span>
      );
    },
  },
];

