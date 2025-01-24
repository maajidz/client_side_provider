import { DocumentsInterface } from "@/types/documentsInterface";
import { ColumnDef } from "@tanstack/react-table";

export const columns = (): ColumnDef<DocumentsInterface>[] => [
  {
    accessorKey: "documentName",
    header: "Document Name",
    cell: ({ row }) => {
      const documentLinks = Array.isArray(row.original.documents.documents)
        ? row.original.documents.documents.filter(
            (link) => link !== null && link !== null
          )
        : [];

      return (
        <div className="cursor-pointer">
          {documentLinks.length > 0 ? (
            documentLinks.map((link, index) => (
              <a
                key={index}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500"
              >
                {row.original.documentName}
              </a>
            ))
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
  {
    accessorKey: "documents",
    header: "Type",
    cell: ({ row }) => {
      return (
        <span className="cursor-pointer">
          {row.original.documents.document_type}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      return (
        <span className="cursor-pointer">
          {new Date(row.original.createdAt).toDateString()}
        </span>
      );
    },
  },
];
