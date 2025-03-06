"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteAlert } from "@/services/chartDetailsServices";
import { AlertData } from "@/types/alertInterface";
import { Ellipsis } from "lucide-react";

const handleDeleteAlert = async (
  alertId: string,
  setLoading: (loading: boolean) => void,
  showToast: (args: { type: string; message: string }) => void,
  fetchAlerts: () => void
) => {
  setLoading(true);
  try {
    await deleteAlert({ id: alertId });
    showToast({
      type: "success",
      message: "Alert deleted successfully",
    });
    fetchAlerts();
  } catch (error) {
    console.error("Error:", error);
    showToast({ type: "error", message: "Failed to delete Alert" });
  } finally {
    setLoading(false);
  }
};

export const columns = ({
  setEditData,
  setIsDialogOpen,
  setLoading,
  showToast,
  fetchAlerts,
}: {
  setEditData: (
    data: {
      alertName: string;
      alertDescription: string;
      alertId: string;
    } | null
  ) => void;
  setIsDialogOpen: React.Dispatch<
    React.SetStateAction<{
      create: boolean;
      edit: boolean;
    }>
  >;
  setLoading: (loading: boolean) => void;
  showToast: (args: { type: string; message: string }) => void;
  fetchAlerts: () => void;
}): ColumnDef<AlertData>[] => [
  {
    accessorKey: "alertDescription",
    header: "Alert Description",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("alertDescription")}</div>
    ),
  },
  {
    accessorKey: "providerId",
    header: "Alert created by",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("providerId")}</div>
    ),
  },
  {
    accessorKey: "alertType",
    header: "Alert type",
    cell: ({ row }) => {
      const alertType = row.original.alertType;
      return <div className="cursor-pointer">{alertType?.alertName}</div>;
    },
  },
  {
    accessorKey: "id",
    header: "",
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
                setEditData({
                  alertName: row.original.alertType.alertName,
                  alertDescription: row.original.alertDescription,
                  alertId: row.original.id,
                });
                setIsDialogOpen((prev) => ({ ...prev, edit: true }));
              }}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                handleDeleteAlert(
                  row.original.id,
                  setLoading,
                  showToast,
                  fetchAlerts
                );
                fetchAlerts();
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
