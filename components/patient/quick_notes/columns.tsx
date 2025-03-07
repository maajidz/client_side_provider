"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteQuickNote } from "@/services/quickNotesServices";
import { QuickNotesInterface } from "@/types/quickNotesInterface";
import generateQuickNotesPDF from "./generateQuickNotesPDF";
import { EllipsisVertical } from "lucide-react";

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
      message: "Note deleted successfully",
    });
    getQuickNotesData();
  } catch (error) {
    console.error("Error:", error);
    showToast({ type: "error", message: "Failed to delete note" });
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
    accessorKey: "providerDetails.providerUniqueId",
    header: "Added by",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.original.providerDetails.providerUniqueId}</div>
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
            <EllipsisVertical size={16} className="text-gray-500"/>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() =>
                generateQuickNotesPDF({ quickNotesData: row.original })
              }
            >
              Print
            </DropdownMenuItem>
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
