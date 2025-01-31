"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteTask } from "@/services/chartDetailsServices";
import { SupplementInterface } from "@/types/supplementsInterface";
import { Ellipsis } from "lucide-react";

const handleSupplementDelete = async (
  taskId: string,
  setLoading: (loading: boolean) => void,
  showToast: (args: { type: string; message: string }) => void
) => {
  setLoading(true);
  try {
    await deleteTask({ id: taskId });
    showToast({
      type: "success",
      message: "supplement deleted successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    showToast({ type: "error", message: "Failed to delete supplement" });
  } finally {
    setLoading(false);
  }
};


export const columns = ({
  setEditData,
  setIsDialogOpen,
  setLoading,
  showToast,
  fetchSupplementsList,
}: {
  setEditData: (data: SupplementInterface | null) => void;
  setIsDialogOpen: (isOpen: boolean) => void;
  setLoading: (loading: boolean) => void;
  showToast: (args: { type: string; message: string }) => void;
  fetchSupplementsList: () => void;
}): ColumnDef<SupplementInterface>[] => [
  {
    accessorKey: "supplement",
    header: "Supplement",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("supplement")}</div>
    ),
  },
  {
    accessorKey: "manufacturer",
    header: "Manufacturer",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("manufacturer")}</div>
    ),
  },
  {
    accessorKey: "fromDate",
    header: "From date",
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
    accessorKey: "toDate",
    header: "To Date",
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "id",
    header: "Actions",
    cell: ({ row }) => (
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Ellipsis />
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
                handleSupplementDelete(row.original.id, setLoading, showToast);
                fetchSupplementsList();
              }}
            >
              Delete
            </DropdownMenuItem>
            <DropdownMenuItem>
              Mark as Inactive
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
