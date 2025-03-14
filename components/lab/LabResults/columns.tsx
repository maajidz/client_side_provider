"use client";
import FormLabels from "@/components/custom_buttons/FormLabels";
import { Badge } from "@/components/ui/badge";
import { Result } from "@/types/labResults";
import { ColumnDef } from "@tanstack/react-table";

export const columns = (): ColumnDef<Result>[] => [
  {
    accessorKey: "id",
    header: "Result ID",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "userDetails",
    header: "Patient ID",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.original.userDetails.patientId}</div>
    ),
  },
  {
    accessorKey: "tests",
    header: "Tests",
    cell: ({ row }) => {
      const tests = row.getValue("tests") as Result["tests"];
      return (
        <div className="cursor-pointer">
          {tests && tests.length > 0 ? (
            tests.map((test) => <span key={test.name}>{test.name}, </span>)
          ) : (
            <span>N/A </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "dateTime",
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
    accessorKey: "testResults",
    header: "Results",
    cell: ({ row }) => {
      const testResults = row.getValue("testResults") as Result["testResults"];
      return (
        <div className="cursor-pointer">
          {testResults.map((results) => (
            <div key={results.id} className="flex flex-col gap-2">
              <FormLabels label="Name" value={results.name} />
              <div className="flex flex-row gap-3">
                <FormLabels
                  label="Result"
                  value={`${results.result} ${results.unit}`}
                />
                <FormLabels
                  label="Range"
                  value={`${results.min}- ${results.max}`}
                />
              </div>
              <FormLabels
                label="Interpretation"
                value={results.interpretation}
              />
              <FormLabels label="Comment" value={results.comment} />
              <FormLabels label="Group Comment" value={results.groupComment} />
            </div>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("tags")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const statusColor =
        row.original.status === "completed" ? "success" : "warning";
      return <Badge variant={`${statusColor}`}>{row.original.status}</Badge>;
    },
  },
];
