"use client";
import { Result } from "@/types/labResults";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import FormLabels from "@/components/custom_buttons/FormLabels";
export const columns = (): ColumnDef<Result>[] => [
  // {
  //   accessorKey: "id",
  //   header: "Result ID",
  //   cell: ({ row }) => (
  //     <div className="cursor-pointer">{row.getValue("id")}</div>
  //   ),
  // },
  {
    accessorKey: "tests",
    header: "Tests",
    cell: ({ row }) => {
      const tests = row.getValue("tests") as Result["tests"];
      return (
        <div className="cursor-pointer">
          {tests.map((test) => (
            <span key={test.name}>{test.name}</span>
          ))}
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
              {/* <FormLabels label="Name" value={results.name} /> */}
                {results.result} {results.unit}
                <span className="text-xs font-medium text-gray-500">({results.min} - {results.max})</span>
              {/* <FormLabels label="Group Comment" value={results.groupComment} /> */}
            </div>
          ))}
        </div>
      );
    },
  },

  {
    accessorKey: "interpretations",
    header: "Interpretation",
    cell: ({ row }) => {
      const testResults = row.getValue("testResults") as Result["testResults"];
      
      return (
        <div className="cursor-pointer">
          {testResults.length > 0 ? (
            testResults.map((results) => {
              // Map interpretation to badge variant
              const badgeVariant = results.interpretation === "Normal" ? "success" : "destructive";
              return (
                <Badge key={results.id} variant={badgeVariant}>
                  {results.interpretation}
                </Badge>
              );
            })
          ) : (
            <span>N/A</span> // Show N/A if there are no test results
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
    header: "Comments",
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
