"use client";
import { Badge } from "@/components/ui/badge";
import { ImageOrdersData } from "@/types/chartsInterface";
import { ColumnDef } from "@tanstack/react-table";

export const columns = (): ColumnDef<ImageOrdersData>[] => [
  {
    accessorKey: "id",
    header: "Image ID",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "ordered_date",
    header: "Ordered On",
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
    accessorKey: "userDetails",
    header: "Patient",
    cell: ({ row }) => (
      <div className="cursor-pointer">{`${row.original.userDetails.user.firstName} ${row.original.userDetails.user.lastName}-${row.original.userDetails.patientId}`}</div>
    ),
  },
  {
    accessorKey: "providerDetails",
    header: "Ordered By",
    cell: ({ row }) => (
      <div className="cursor-pointer">
        {`${row.original.providerDetails.firstName} ${row.original.providerDetails.lastName} - `}
        {row.original.providerDetails.providerDetails.providerUniqueId}
      </div>
    ),
  },
  {
    accessorKey: "imageType",
    header: "Image Type",
    cell: ({ row }) => {
      const imageType = row.getValue(
        "imageType"
      ) as ImageOrdersData["imageType"];
      return (
        <div className="cursor-pointer">
          <span key={imageType?.id}>{imageType?.name} </span>
        </div>
      );
    },
  },
  {
    accessorKey: "imageTests",
    header: "Image Tests",
    cell: ({ row }) => {
      const imageTests = row.getValue(
        "imageTests"
      ) as ImageOrdersData["imageTests"];
      return (
        <div className="cursor-pointer">
          {imageTests?.map((imageTests) => (
            <span key={imageTests?.id}>{imageTests?.name}, </span>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <Badge
          variant={row.original.status === "Confirmed" ? "success" : "default"}
        >
          {row.original.status}
        </Badge>
      );
    },
  },
];
