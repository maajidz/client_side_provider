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
import { AlertDataInterface } from "@/types/alertInterface";
import { EllipsisVertical } from "lucide-react";

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
}): ColumnDef<AlertDataInterface>[] => [
  {
    accessorKey: "providerPatientDetails",
    header: "Alert created by",
    cell: ({ row }) => {
      const providerDetails = row.original.providerPatientDetails;
      return (
        <div className="cursor-pointer">{`${providerDetails.provider.firstName} ${providerDetails.provider.lastName}`}</div>
      );
    },
  },
  {
    accessorKey: "alertType",
    header: "Alert Name",
    cell: ({ row }) => {
      const alertName = row.original.alert.alertType.alertName;
      return (
        <div className="cursor-pointer">{alertName}</div>
      );
    },
  },
  {
    accessorKey: "alertDescription",
    header: "Alert Description",
    cell: ({ row }) => {
      const alertDescription = row.original.alert.alertDescription;
      return (
        <div className="cursor-pointer">{alertDescription}</div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <EllipsisVertical size={16} className="text-gray-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setEditData({
                    alertName: row.original.alert.alertType.alertName,
                    alertDescription: row.original.alert.alertDescription,
                    alertId: row.original.alert.id,
                  });
                  setIsDialogOpen((prev) => ({ ...prev, edit: true }));
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  handleDeleteAlert(
                    row.original.alert.id,
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
      );
    },
  },
];
