import { Badge } from "@/components/ui/badge";
import { FamilyHistoryResponseInterface } from "@/types/familyHistoryInterface";
import { ColumnDef } from "@tanstack/react-table";

export const columns = (): ColumnDef<FamilyHistoryResponseInterface>[] => [
  {
    accessorKey: "relationship",
    header: "Relationship",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("relationship")} {row.original.deceased ? ("(Deceased)"): ("")}</div>
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
              variant="warning"
            >
              {problem.name}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "comments",
    header: "Comments",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("comments")}</div>
    ),
  },
];
