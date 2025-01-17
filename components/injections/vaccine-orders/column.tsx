import { VaccinesInterface } from "@/types/injectionsInterface";
import { ColumnDef } from "@tanstack/react-table";

export const columns = (): ColumnDef<VaccinesInterface>[] => [
  {
    accessorKey: "userDetails.user.firstName",
    header: "Patient",
    cell: ({ row }) => (
      <div className="cursor-pointer">
        {row.original.userDetails.user.firstName}{" "}
        {row.original.userDetails.user.lastName}
      </div>
    ),
  },
  {
    accessorKey: "vaccine_name",
    header: "Vaccine Name",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("vaccine_name")}</div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Ordered On",
    cell: ({ row }) => (
      <div className="cursor-pointer">
        {new Date(row.original.createdAt).toDateString()}
      </div>
    ),
  },
  {
    accessorKey: "providerName",
    header: "Ordered By",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("providerName")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Order Status",
    cell: ({ row }) => {
      return (
        <span
          className={
            row.original.status.trim().toLowerCase() === "pending"
              ? "text-yellow-500 font-semibold cursor-pointer"
              : "text-green-500 font-semibold cursor-pointer"
          }
        >
          {row.original.status.toUpperCase()}
        </span>
      );
    },
  },
];
