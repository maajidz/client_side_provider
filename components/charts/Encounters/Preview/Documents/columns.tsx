"use client"
import { ImageResultDataResponse } from "@/types/imageResults";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const columns = (): ColumnDef<ImageResultDataResponse>[] => [
  {
    accessorKey: "testResults",
    header: "Documents",
    cell: ({ row }) => {
      const testResults = row.getValue(
        "testResults"
      ) as ImageResultDataResponse["testResults"];
      return (
        <div className="cursor-pointer">
          {testResults.flatMap((results) =>
            results.documents?.map((docs, index) => (
              // <Button
              //   key={index}
              //   variant={"link"}
              //   onClick={() => window.open(docs, "_blank")}
              //   className="text-blue-500"
              // >
              //   {docs.split("/").pop()}
              // </Button>
              <Link key={index} href={docs} className="text-blue-500">
                 {docs.split("/").pop()}
              </Link>
            ))
          )}
        </div>
      );
    },
  },
];
