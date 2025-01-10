"use client";
import { Button } from "@/components/ui/button";
import { ImageResultDataResponse } from "@/types/imageResults";
import { ColumnDef } from "@tanstack/react-table";

export const columns = (): ColumnDef<ImageResultDataResponse>[] => [
  {
    accessorKey: "testResults",
    header: "Image Type",
    cell: ({ row }) => {
      const testResults = row.getValue(
        "testResults"
      ) as ImageResultDataResponse["testResults"];
      return (
        <div className="cursor-pointer">
          {testResults.map((results) => 
              results.imageTest.imageType.name
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "testResults",
    header: "Documents",
    cell: ({ row }) => {
      const testResults = row.getValue(
        "testResults"
      ) as ImageResultDataResponse["testResults"];
      return (
        <div className="cursor-pointer">
          {testResults.map((results) => (
            <div key={results.id} className="flex flex-col gap-2">
                  {results.documents?.map((docs, index) => (
                    <Button key={index} variant={"link"} onClick={()=> window.open(docs, "_blank")} className="text-blue-500">{docs.split('/').pop()}</Button>
                  ))}
            </div>
          ))}
        </div>
      );
    },
  }
];
