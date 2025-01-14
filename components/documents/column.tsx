import { DocumentsInterface } from "@/types/documentsInterface";
import { ColumnDef } from "@tanstack/react-table";

export const columns = (): ColumnDef<DocumentsInterface>[] => [
  {
    accessorKey: "patient",
    header: "Patient",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("patient")}</div>
    ),
  },
  {
    accessorKey: "documentName",
    header: "Document Name",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("documentName")}</div>
    ),
  },
  {
    accessorKey: "internalComments",
    header: "Internal Comments",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("internalComments")}</div>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("date")}</div>
    ),
  },
];