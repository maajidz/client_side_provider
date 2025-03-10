import { ProcedureData } from "@/types/procedureInterface";
import { ColumnDef } from "@tanstack/react-table";

export const columns = (): ColumnDef<ProcedureData>[] => [
  {
    accessorKey: "nameType",
    header: "Name",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.original.nameType.name}</div>
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
    cell: ({ getValue }) => {
      const dob = getValue() as string;
      const date = new Date(dob);
      return (
        <div className="cursor-pointer">
          {date.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "toDate",
    header: "To Date",
    cell: ({ getValue }) => {
      const dob = getValue() as string;
      const date = dob ? new Date(dob) : null;
      return (
        <div className="cursor-pointer">
          {date ? date.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          }) : "N/A"}
        </div>
      );
    },
  },
  {
    accessorKey: "notes",
    header: "Notes",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("notes")}</div>
    ),
  },
];
