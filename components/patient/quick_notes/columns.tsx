"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { QuickNotesInterface } from "@/types/quickNotesInterface";
import { deleteQuickNote } from "@/services/quickNotesServices";

const handleDeleteQuickNote = async (
  id: string,
  setLoading: (loading: boolean) => void,
  showToast: (args: { type: string; message: string }) => void,
  getQuickNotesData: () => void
) => {
  setLoading(true);
  try {
    await deleteQuickNote({ id });
    showToast({
      type: "success",
      message: "Quick note deleted successfully",
    });
    getQuickNotesData();
  } catch (error) {
    console.error("Error:", error);
    showToast({ type: "error", message: "Failed to delete quick note" });
  } finally {
    setLoading(false);
  }
};

export const columns = ({
  setEditData,
  setIsDialogOpen,
  setLoading,
  showToast,
  fetchQuickNotes,
}: {
  setIsDialogOpen: (isOpen: boolean) => void;
  setEditData: React.Dispatch<
    React.SetStateAction<{ notes: string; noteId: string } | null>
  >;
  setLoading: (loading: boolean) => void;
  showToast: (args: { type: string; message: string }) => void;
  fetchQuickNotes: () => void;
}): ColumnDef<QuickNotesInterface>[] => [
  {
    accessorKey: "note",
    header: "Note",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("note")}</div>
    ),
  },
  {
    accessorKey: "providerDetails.id",
    header: "Added by",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.original.providerDetails.id}</div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => (
      <div className="cursor-pointer">
        {new Date(row.original.createdAt).toDateString()}
      </div>
    ),
  },
  {
    accessorKey: "id",
    header: "",
    cell: ({ row }) => (
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <DotsVerticalIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setEditData({
                  notes: row.original.note,
                  noteId: row.original.id,
                });
                setIsDialogOpen(true);
              }}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                handleDeleteQuickNote(
                  row.original.id,
                  setLoading,
                  showToast,
                  fetchQuickNotes
                );
                fetchQuickNotes();
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
