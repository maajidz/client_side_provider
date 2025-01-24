import { HistoricalVaccineInterface } from "@/types/chartsInterface";
import { ColumnDef } from "@tanstack/react-table";

export const columns = (): ColumnDef<HistoricalVaccineInterface>[] => [
  {
    accessorKey: "vaccine_name",
    header: "Vaccine Name",
    cell: ({ row }) => (
      <div className="flex flex-col gap-2 cursor-pointer">
        <h6 className="text-md font-semibold">{row.original.vaccine_name}</h6>
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Historical Source</span>{" "}
          <span className="font-semibold">
            {row.original.source === ""
              ? "Source not specified"
              : row.original.source}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "date",
    header: "DateTime",
    cell: ({ row }) => (
      <div className="cursor-pointer">
        {new Date(row.original.date).toLocaleDateString()}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div
        className={`cursor-pointer ${
          row.original.status === "pending"
            ? "text-yellow-500"
            : "text-green-500"
        }`}
      >
        {row.original.status.toUpperCase()}
      </div>
    ),
  },
];
