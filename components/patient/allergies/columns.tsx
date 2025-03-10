"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteAllergies } from "@/services/chartDetailsServices";
import { AllergenResponseInterfae } from "@/types/allergyInterface";
import { EllipsisVertical } from "lucide-react";

const handleDeleteAllergy = async (
  allergyId: string,
  setLoading: (loading: boolean) => void,
  showToast: (args: { type: string; message: string }) => void,
  fetchAllergies: () => void
) => {
  setLoading(true);
  try {
    await deleteAllergies({ allergyId: allergyId });
    showToast({
      type: "success",
      message: "Allergy deleted successfully",
    });
    fetchAllergies();
  } catch (error) {
    console.error("Error:", error);
    showToast({ type: "error", message: "Failed to delete Allergy" });
  } finally {
    setLoading(false);
  }
};

export const columns = ({
  setEditData,
  setIsDialogOpen,
  setLoading,
  showToast,
  fetchAllergies,
}: {
  setEditData: (data: AllergenResponseInterfae) => void;
  setIsDialogOpen: (isOpen: boolean) => void;
  setLoading: (loading: boolean) => void;
  showToast: (args: { type: string; message: string }) => void;
  fetchAllergies: () => void;
}): ColumnDef<AllergenResponseInterfae>[] => [
  {
    accessorKey: "allergyType",
    header: "Allergy Type",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.original.allergyType.name}</div>
    ),
  },
  {
    accessorKey: "serverity",
    header: "Severity",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("serverity")}</div>
    ),
  },
  {
    accessorKey: "Allergen",
    header: "Allergen",
    cell: ({ row }) => {
      return <div className="cursor-pointer">{row.getValue("Allergen")}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return <div className="cursor-pointer">{row.getValue("status")}</div>;
    },
  },
  {
    accessorKey: "observedOn",
    header: "Observed On",
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
    accessorKey: "providerName",
    header: "Provider ID",
    cell: ({ row }) => {
      return <div className="cursor-pointer">{row.original.providerName}</div>;
    },
  },
  {
    accessorKey: "reactions",
    header: "reactions",
    cell: ({ row }) => {
      const reactions = row.getValue(
        "reactions"
      ) as AllergenResponseInterfae["reactions"];
      return (
        <>
          {reactions ? (
            reactions.map((reaction) => (
              <div key={reaction.id}>
                {reaction.name}
              </div>
            ))
          ) : (
            <div>No reaction</div>
          )}
        </>
      );
    },
  },
  {
    accessorKey: "id",
    header: "",
    cell: ({ row }) => (
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <EllipsisVertical size={16} className="text-gray-500"/>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setEditData(row.original);
                setIsDialogOpen(true);
              }}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                handleDeleteAllergy(
                  row.original.id,
                  setLoading,
                  showToast,
                  fetchAllergies
                );
                fetchAllergies();
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
