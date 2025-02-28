import { Badge } from "@/components/ui/badge";
import { Device } from "@/types/implantedDevices";
import { ColumnDef } from "@tanstack/react-table";

export const columns = (): ColumnDef<Device>[] => [
  {
    accessorKey: "UDI",
    header: "UDI",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.original?.device_type?.UDI}</div>
    ),
  },
  {
    accessorKey: "implant_name",
    header: "Implant Name",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.original?.device_type?.implant_name}</div>
    ),
  },
  {
    accessorKey: "implant_date",
    header: "Implant Date",
    cell: ({ row }) => (
      <div className="cursor-pointer">
        <div className="cursor-pointer">
          {new Date(row.original?.device_type?.implant_date).toDateString()}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const statusColor =
        row.original?.device_type?.status?.toLowerCase() === "active"
          ? "success"
          : "default";

      return (
        <Badge variant={`${statusColor}`}>
          {row.original?.device_type?.status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "brand_name",
    header: "Brand Name",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.original?.device_type?.brand_name}</div>
    ),
  },
  {
    accessorKey: "version_or_model",
    header: "Version/Model",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.original?.device_type?.version_or_model}</div>
    ),
  },
  {
    accessorKey: "company_name",
    header: "Company Name",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.original?.device_type?.company_name}</div>
    ),
  },
  {
    accessorKey: "mri_compatible",
    header: "MRI Compatible",
    cell: ({ row }) => {
      const mriColor = row.original?.device_type?.mri_compatible
        ? "success"
        : "default";

      return (
        <Badge variant={`${mriColor}`}>
          {row.original?.device_type?.mri_compatible ? "True" : "False"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "latex_content",
    header: "Latex Content",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.original?.device_type?.latex_content}</div>
    ),
  },
];
