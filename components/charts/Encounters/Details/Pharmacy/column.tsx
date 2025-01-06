import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { PharmacyInterface } from "@/types/pharmacyInterface";

export const columns = (): ColumnDef<PharmacyInterface>[] => [
  {
    accessorKey: "name",
    header: "Pharmacy Name",

    enableSorting: true,
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "state",
    header: "State",
  },
  {
    accessorKey: "country",
    header: "Country",
  },
  {
    accessorKey: "add",
    header: "Add",
    cell: () => {
      return <Button variant="default">Add</Button>;
    },
  },
];

