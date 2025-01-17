"use client"
import { Button } from "@/components/ui/button";
import { ImageResultDataResponse } from "@/types/imageResults";
import { ColumnDef } from "@tanstack/react-table";

export const columns = (): ColumnDef<ImageResultDataResponse>[] => [
  {
    accessorKey: "testResults",
    header: "Documents",
    cell: ({ row }) => {
      const testResults = row.getValue(
        "testResults"
      ) as ImageResultDataResponse["testResults"];
      return (
        <div className="cursor-pointer w-96">
          {testResults.flatMap((results) =>
            results.documents?.map((docs, index) => (
              <Button
                key={index}
                variant={"link"}
                onClick={() => window.open(docs, "_blank")}
                className="text-blue-500 px-0 py-0 "
              >
                {docs.split("/").pop()}
              </Button>
            ))
          )}
        </div>
      );
    },
  },
];
