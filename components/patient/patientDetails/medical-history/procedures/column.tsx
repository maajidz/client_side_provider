import { ProceduresInterface } from "@/types/procedureInterface";
import { ColumnDef } from "@tanstack/react-table";

export const columns = (): ColumnDef<ProceduresInterface>[] => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("type")}</div>
    ),
  },
  {
    accessorKey: "fromDate",
    header: "From Date",
    cell: ({ row }) => (
      <div className="cursor-pointer">
        {new Date(row.getValue("fromDate")).toDateString()}
      </div>
    ),
  },
  {
    accessorKey: "toDate",
    header: "To Date",
    cell: ({ row }) => (
      <div className="cursor-pointer">
        {new Date(row.getValue("toDate")).toDateString()}
      </div>
    ),
  },
  {
    accessorKey: "notes",
    header: "Notes",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("notes")}</div>
    ),
  },
];
