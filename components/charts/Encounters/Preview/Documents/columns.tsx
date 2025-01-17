"use client"
import { ColumnDef } from "@tanstack/react-table";
import { DocumentsInterface } from "@/types/documentsInterface";
        
export const columns = (): ColumnDef<DocumentsInterface>[] => [
  {
    accessorKey: "documentName",
    header: "Documents",
    cell: ({ row }) => {
      const documentLinks = row.original.documents.filter(
        (link) => link !== null && link !== undefined
      );

      return (
        <div className="cursor-pointer">
          {documentLinks.length > 0 ? (
            documentLinks.map((link, index) => {
              return (
                <a
                  key={index}
                  href={link}
                  target="_blank"
                  className="text-blue-500"
                >
                  {row.original.documentName}
                </a>
              );
            })
          ) : (
            <span className="text-md text-gray-500">
              No valid document links available for document:{" "}
              <span className="text-md font-semibold">
                {row.original.documentName}
              </span>
            </span>
          )}
        </div>
      );
    },
  },
];
