"use client";
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
    accessorKey: "status",
    header: "Result Status",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("status")}</div>
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
    accessorKey: "providerId",
    header: "Ordered By",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("providerId")}</div>
    ),
  },
  {
    accessorKey: "imageType",
    header: "Image Type",
    cell: ({ row }) => {
      const imageType = row.getValue("imageType") as ImageOrdersData["imageType"];
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
      const imageTests = row.getValue("imageTests") as ImageOrdersData["imageTests"];
      return (
        <div className="cursor-pointer">
          {imageTests?.map((imageTests) => (
            <span key={imageTests?.id}>{imageTests?.name}, </span>
          ))}
        </div>
      );
    },
  }
];
