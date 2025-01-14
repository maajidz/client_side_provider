import { VaccinesInterface } from "@/types/injectionsInterface";
import { ColumnDef } from "@tanstack/react-table";

export const columns = (): ColumnDef<VaccinesInterface>[] => [
  {
    accessorKey: "patient",
    header: "Patient",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("patient")}</div>
    ),
  },
  {
    accessorKey: "vaccineName",
    header: "Vaccine Name",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("vaccineName")}</div>
    ),
  },
  {
    accessorKey: "orderedOn",
    header: "Ordered On",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("orderedOn")}</div>
    ),
  },
  {
    accessorKey: "orderedBy",
    header: "Ordered By",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("orderedBy")}</div>
    ),
  },
  {
    accessorKey: "orderStatus",
    header: "Order Status",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("orderStatus")}</div>
    ),
  },
];
