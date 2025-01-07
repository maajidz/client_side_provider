import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { PharmacyInterface } from "@/types/pharmacyInterface";

export const columns = (
  handleAdd: (row: PharmacyInterface) => void
): ColumnDef<PharmacyInterface>[] => [
  {
    id: "name",
    accessorKey: "name",
    header: "Pharmacy Name",

    enableSorting: true,
  },
  {
    id: "city",
    accessorKey: "city",
    header: "City",
  },
  {
    id: "address",
    accessorKey: "address",
    header: "Address",
  },
  {
    id: "state",
    accessorKey: "state",
    header: "State",
  },
  {
    id: "country",
    accessorKey: "country",
    header: "Country",
  },
  {
    id: "phoneNumber",
    accessorKey: "phoneNumber",
    header: "Phone No.",
  },
  {
    id: "zipCode",
    accessorKey: "zipCode",
    header: "Zip Code",
  },
  {
    id: "action",
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      const rowData = row.original;

      return (
        <Button variant="default" onClick={() => handleAdd(rowData)}>
          Add
        </Button>
      );
    },
  },
];
