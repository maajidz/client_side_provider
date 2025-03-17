"use client";
import { Badge } from "@/components/ui/badge";
import { LabOrdersData } from "@/types/chartsInterface";
import { ColumnDef } from "@tanstack/react-table";
import { Icon } from "@/components/ui/icon";

export const columns = (): ColumnDef<LabOrdersData>[] => [
  // {
  //   accessorKey: "id",
  //   header: "Lab ID",
  //   cell: ({ row }) => (
  //     <div className="cursor-pointer">{row.getValue("id")}</div>
  //   ),
  // },
  {
    accessorKey: "tests",
    header: "Tests",
    cell: ({ row }) => {
      const tests = row.getValue("tests") as LabOrdersData["tests"];
      return (
        <div className="cursor-pointer">
          {tests.map((test) => (
            <span key={test.id}>{test.name}</span>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "userDetails",
    header: "Patient ID",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.original.userDetails.patientId}</div>
    ),
  },
  // {
  //   accessorKey: "id",
  //   header: "Lab ID",
  //   cell: ({ row }) => (
  //     <div className="cursor-pointer">{row.getValue("id")}</div>
  //   ),
  // },
  {
    accessorKey: "providerDetails",
    header: "Ordered by",
    cell: ({ row }) => (
      <div className="cursor-pointer">
        {row.original.providerDetails.providerUniqueId}
      </div>
    ),
  },
  {
    accessorKey: "isSigned",
    header: "Is Signed",
    cell: ({ row }) => {
      const isSigned = row.getValue("isSigned");
      const badgeVariant = isSigned ? "success" : "warning";
      const statusText = isSigned ? "Signed" : "Not Signed";
      const iconName = isSigned ? "check" : "warning";

      return (
        <Badge variant={badgeVariant} className="min-w-fit">
          <Icon name={iconName} size={16} className="mr-1" />
          {statusText}
        </Badge>
      );
    },
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <Badge
          variant={
            row.original.status === "active"
              ? "success"
              : "default"
          }
        >
          {row.original.status}
        </Badge>
      );
    },
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
];
