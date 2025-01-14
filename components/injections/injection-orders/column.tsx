import { InjectionsInterface } from "@/types/injectionsInterface";
import { ColumnDef } from "@tanstack/react-table";

export const columns = (): ColumnDef<InjectionsInterface>[] => [
  {
    accessorKey: "patient",
    header: "Patient",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("patient")}</div>
    ),
  },
  {
    accessorKey: "drugName",
    header: "Drug Name",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("drugName")}</div>
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
