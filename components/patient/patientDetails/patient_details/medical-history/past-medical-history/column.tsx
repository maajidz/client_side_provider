import { PastMedicalHistoryInterface } from "@/services/pastMedicalHistoryInterface";
import { ColumnDef } from "@tanstack/react-table";

export const columns = (): ColumnDef<PastMedicalHistoryInterface>[] => [
  {
    accessorKey: "notes",
    header: "Notes",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("notes")}</div>
    ),
  },
  {
    accessorKey: "glp_refill_note_practice",
    header: "Glp Refill Note Practice",
    cell: ({ row }) => (
      <div className="cursor-pointer">
        {row.getValue("glp_refill_note_practice")}
      </div>
    ),
  },
];

