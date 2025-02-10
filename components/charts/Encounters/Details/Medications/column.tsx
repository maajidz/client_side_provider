import GhostButton from "@/components/custom_buttons/buttons/GhostButton";
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
    header: "",
    cell: ({ row }) => {
      const rowData = row.original;

      return (
        <GhostButton onClick={() => handleSelectedMedication(rowData)}>
          + Add
        </GhostButton>
      );
    },
  },
];
