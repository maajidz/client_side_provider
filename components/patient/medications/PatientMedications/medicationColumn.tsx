import { MedicationResultInterface } from "@/types/medicationInterface";
import { ColumnDef } from "@tanstack/react-table";

export const MedicationColumn = (): ColumnDef<MedicationResultInterface>[] => [
  {
    accessorKey: "productName",
    header: "Name",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.original.productName}</div>
    ),
  },
  {
    accessorKey: "tradeName",
    header: "Trade Name",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.original.tradeName}</div>
    ),
  },
  {
    accessorKey: "route",
    header: "Route",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.original.route}</div>
    ),
  },
  {
    accessorKey: "strength",
    header: "Strength",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.original.strength}</div>
    ),
  },
  {
    accessorKey: "doseForm",
    header: "Dose Form",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.original.doseForm}</div>
    ),
  },
];
