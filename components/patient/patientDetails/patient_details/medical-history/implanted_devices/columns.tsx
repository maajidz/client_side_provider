import { ImplantedDevices } from "@/types/implantedDevices";
import { ColumnDef } from "@tanstack/react-table";

export const columns = (): ColumnDef<ImplantedDevices>[] => [
  {
    accessorKey: "UDI",
    header: "UDI",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("UDI")}</div>
    ),
  },
  {
    accessorKey: "implant_name",
    header: "Implant Name",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("implant_name")}</div>
    ),
  },
  {
    accessorKey: "implant_date",
    header: "Implant Date",
    cell: ({ row }) => (
      <div className="cursor-pointer">
        {new Date(row.getValue("implant_date")).toDateString()}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="cursor-pointer">
        {new Date(row.getValue("status")).toDateString()}
      </div>
    ),
  },
  {
    accessorKey: "brand_name",
    header: "Brand Name",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("brand_name")}</div>
    ),
  },
  {
    accessorKey: "version_or_model",
    header: "Version/Model",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("version_or_model")}</div>
    ),
  },
  {
    accessorKey: "company_name",
    header: "Company Name",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("company_name")}</div>
    ),
  },
  {
    accessorKey: "mri_compatible",
    header: "MRI Compatible",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("mri_compatible")}</div>
    ),
  },
  {
    accessorKey: "latex_content",
    header: "Latex Content",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("latex_content")}</div>
    ),
  },
];
