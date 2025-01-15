import { DocumentsInterface } from "@/types/documentsInterface";
import { ColumnDef } from "@tanstack/react-table";

export const columns = (): ColumnDef<DocumentsInterface>[] => [
  {
    accessorKey: "patientName",
    header: "Patient",
  },
  {
    accessorKey: "documentName",
    header: "Document Name",
  },
  {
    accessorKey: "internalComment",
    header: "Internal Comments",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      return <span>{new Date(row.original.createdAt).toDateString()}</span>;
    },
  },
];
