import { Badge } from "@/components/ui/badge";
import { FamilyHistoryResponseInterface } from "@/types/familyHistoryInterface";
import { ColumnDef } from "@tanstack/react-table";

export const columns = (): ColumnDef<FamilyHistoryResponseInterface>[] => [
  {
    accessorKey: "relationship",
    header: "Relationship",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("relationship")}</div>
    ),
  },
  {
    accessorKey: "age",
    header: "Age",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("age")}</div>
    ),
  },
  {
    accessorKey: "activeProblems",
    header: "Active Problems",
    cell: ({ row }) => {
      const { activeProblems } = row.original;

      return (
        <div className="flex gap-2 cursor-pointer">
          {activeProblems.map((problem) => (
            <Badge
              key={problem.id}
              variant="default"
            >
              {problem.name}
            </Badge>
          ))}
        </div>
      );
    },
  },

  {
    accessorKey: "deceased",
    header: "Deceased",
    cell: ({ row }) => (
      <div className="cursor-pointer">
        {row.getValue("deceased") === true ? "True" : "False"}
      </div>
    ),
  },
  {
    accessorKey: "comments",
    header: "Comments",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("comments")}</div>
    ),
  },
];
