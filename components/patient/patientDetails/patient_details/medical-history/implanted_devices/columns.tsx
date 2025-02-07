import { ImplantedDevices } from "@/types/implantedDevices";
import { ColumnDef } from "@tanstack/react-table";

export const columns = (): ColumnDef<ImplantedDevices>[] => [
  {
    accessorKey: "UDI",
    header: "UDI",
    cell: ({ row }) => <div className="cursor-pointer">{row.original.UDI}</div>,
  },
  {
    accessorKey: "implant_name",
    header: "Implant Name",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.original.implant_name}</div>
    ),
  },
  {
    accessorKey: "implant_date",
    header: "Implant Date",
    cell: ({ row }) => (
      <div className="cursor-pointer">
        <div className="cursor-pointer">
          {new Date(row.original.implant_date).toDateString()}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const statusColor =
        row.original.status.toLowerCase() === "active"
          ? "text-green-500"
          : "text-red-500";

      return (
        <div className={`cursor-pointer capitalize ${statusColor}`}>
          {row.original.status}
        </div>
      );
    },
  },
  {
    accessorKey: "brand_name",
    header: "Brand Name",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.original.brand_name}</div>
    ),
  },
  {
    accessorKey: "version_or_model",
    header: "Version/Model",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.original.version_or_model}</div>
    ),
  },
  {
    accessorKey: "company_name",
    header: "Company Name",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.original.company_name}</div>
    ),
  },
  {
    accessorKey: "mri_compatible",
    header: "MRI Compatible",
    cell: ({ row }) => {
      const mriColor = row.original.mri_compatible
        ? "text-green-500"
        : "text-red-500";

      return (
        <div className={`cursor-pointer capitalize ${mriColor}`}>
          {row.original.mri_compatible ? "True" : "False"}
        </div>
      );
    },
  },
  {
    accessorKey: "latex_content",
    header: "Latex Content",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.original.latex_content}</div>
    ),
  },
];
