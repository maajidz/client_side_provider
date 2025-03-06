"use client";
import { Badge } from "@/components/ui/badge";
import { LabOrdersData } from "@/types/chartsInterface";
import { ColumnDef } from "@tanstack/react-table";

export const columns = (): ColumnDef<LabOrdersData>[] => [
  {
    accessorKey: "id",
    header: "Lab ID",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "orderedBy",
    header: "Ordered by",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("orderedBy")}</div>
    ),
  },
 {
    accessorKey: "date",
    header: "Date",
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
    accessorKey: "isSigned",
    header: "Is signed",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("isSigned") ? "Yes": "No"}</div>
    ),
  },
  {
    accessorKey: "labs",
    header: "Labs",
    cell: ({ row }) => {
      const labs = row.getValue("labs") as LabOrdersData["labs"];
      return (
        <div className="cursor-pointer">
          {labs.map((lab) => (
            <span key={lab.id}>{lab.name} </span>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "tests",
    header: "Tests",
    cell: ({ row }) => {
      const tests = row.getValue("tests") as LabOrdersData["tests"];
      return (
        <div className="cursor-pointer">
          {tests.map((test) => (
            <span key={test.id}>{test.name}, </span>
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
          variant={
            row.original.status === "completed"
              ? "success"
              : "default"
          }
        >
          {row.original.status}
        </Badge>
      );
    },
  },
];
