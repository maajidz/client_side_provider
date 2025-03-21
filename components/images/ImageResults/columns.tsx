"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { ImageResultDataResponse } from "@/types/imageResults";
import { ColumnDef } from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

export const columns = (): ColumnDef<ImageResultDataResponse>[] => [
  // {
  //   accessorKey: "id",
  //   header: "Result ID",
  //   cell: ({ row }) => (
  //     <div >{row.getValue("id")}</div>
  //   ),
  // },
  {
    accessorKey: "userDetails",
    header: "Patient Name",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <a
          href={`/patient-details/${row.original.userDetails.user.id}`}
          className="text-blue-600 hover:underline"
        >
          {`${row.original.userDetails.user.firstName} ${row.original.userDetails.user.lastName}`}
        </a>
        <Badge>{`${row.original.userDetails.patientId}`}</Badge>
      </div>
    ),
  },
  {
    accessorKey: "providerDetails",
    header: "Reviewer",
    cell: ({ row }) => (
      <div>
        {row.original.providerDetails.firstName}{" "}
        {row.original.providerDetails.lastName}
      </div>
    ),
  },
  {
    accessorKey: "dateTime",
    header: "Date",
    cell: ({ getValue }) => {
      const dob = getValue() as string;
      const date = new Date(dob);
      return (
        <div>
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
    header: "Tests",
    cell: ({ row }) => {
      const testResults = row.getValue("testResults") as ImageResultDataResponse["testResults"];
      return (
        <div>
          {testResults.map((results) => (
            <div key={results.id} className="flex flex-row gap-2 items-center">
              <span>{results.imageTest?.imageType?.name}</span>
              <span className="text-gray-500">({results.interpretation})</span>
              {results.documents && results.documents.length > 0 ? (
                results.documents.length === 1 ? (
                  <Button
                    variant="link"
                    onClick={() => window.open((results.documents as string[])[0], "_blank")}
                  >
                    <Icon name="picture_as_pdf" />
                  </Button>
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost">
                        {results.documents.length} <Icon name="picture_as_pdf" />
                        <Icon name="arrow_drop_down" className="ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {results.documents?.map((docs, index) => (
                        <DropdownMenuItem key={index} onClick={() => window.open(docs, "_blank")}>
                          {docs.split('/').pop()}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )
              ) : (
                <span>-</span>
              )}
            </div>
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
