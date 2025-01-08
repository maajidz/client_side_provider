import { Button } from "@/components/ui/button";
import { MedicationResultInterface } from "@/types/medicationInterface";
import { ColumnDef } from "@tanstack/react-table";

export const columns = (
  handleSelectedMedication: (row: MedicationResultInterface) => void
): ColumnDef<MedicationResultInterface>[] => [
  {
    id: "result.productName",
    accessorKey: "productName",
    header: "Product Name",
  },
  {
    id: "result.tradeName",
    accessorKey: "tradeName",
    header: "Trade Name",
  },
  {
    id: "result.strength",
    accessorKey: "strength",
    header: "Strength",
  },
  {
    id: "result.route",
    accessorKey: "route",
    header: "Route",
  },
  {
    id: "result.doseForm",
    accessorKey: "doseForm",
    header: "Dose Form",
  },
  {
    id: "action",
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      const rowData = row.original;

      return (
        <Button
          variant="default"
          onClick={() => handleSelectedMedication(rowData)}
        >
          Add
        </Button>
      );
    },
  },
];

