"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  deleteSupplement,
  updateSupplement,
} from "@/services/chartDetailsServices";
import {
  SupplementInterface,
  SupplementInterfaceResponse,
  UpdateSupplementType,
} from "@/types/supplementsInterface";
import { EllipsisVertical } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { Badge } from "@/components/ui/badge";

const handleSupplementDelete = async (
  id: string,
  setLoading: (loading: boolean) => void,
  showToast: (args: { type: string; message: string }) => void,
  fetchSupplements: () => void
) => {
  setLoading(true);
  try {
    await deleteSupplement(id);
    showToast({
      type: "success",
      message: "supplement deleted successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    showToast({ type: "error", message: "Failed to delete supplement" });
  } finally {
    setLoading(false);
    fetchSupplements();
  }
};

const handleSupplementStatus = async (
  status: "Active" | "Inactive",
  id: string,
  supplementData: SupplementInterface,
  setLoading: (loading: boolean) => void,
  showToast: (args: { type: string; message: string }) => void,
  fetchSupplements: () => void
) => {
  setLoading(true);
  const requestData: UpdateSupplementType = {
    supplementId: supplementData.supplement,
    supplement: supplementData.supplement,
    manufacturer: supplementData.manufacturer,
    fromDate: supplementData.fromDate,
    toDate: supplementData.toDate,
    status: status,
    dosage: supplementData.dosage,
    unit: supplementData.unit,
    frequency: supplementData.unit,
    intake_type: supplementData.intake_type,
    comments: supplementData.comments,
    userDetailsId: supplementData.userDetailsId,
  };
  try {
    await updateSupplement({
      requestData: requestData,
      supplementId: id,
    });
    showToast({
      type: "success",
      message: "supplement deleted successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    showToast({ type: "error", message: "Failed to delete supplement" });
  } finally {
    setLoading(false);
    fetchSupplements();
  }
};

export const columns = ({
  setEditData,
  setIsDialogOpen,
  setLoading,
  showToast,
  fetchSupplementsList,
}: {
  setEditData: (data: SupplementInterfaceResponse | null) => void;
  setIsDialogOpen: Dispatch<
    SetStateAction<{
      create: boolean;
      edit: boolean;
    }>
  >;
  setLoading: (loading: boolean) => void;
  showToast: (args: { type: string; message: string }) => void;
  fetchSupplementsList: () => void;
}): ColumnDef<SupplementInterfaceResponse>[] => [
  {
    accessorKey: "supplementType",
    header: "Supplement Name",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.original.supplementType.name}</div>
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
  // {
  //   accessorKey: "status",
  //   header: "Status",
  //   cell: ({ row }) => (
  //     <div className="cursor-pointer">{row.getValue("status")}</div>
  //   ),
  // },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const statusColor =
        row.original.status.toLowerCase() === "active"
          ? "success"
          : "warning";

      return <Badge variant={`${statusColor}`}>{row.original.status}</Badge>;
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
                setIsDialogOpen((prev) => ({ ...prev, edit: true }));
              }}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                handleSupplementDelete(
                  row.original.id,
                  setLoading,
                  showToast,
                  fetchSupplementsList
                );
              }}
            >
              Delete
            </DropdownMenuItem>
            {row.original.status === "Inactive" ? (
              <DropdownMenuItem
                onClick={() => {
                  handleSupplementStatus(
                    "Active",
                    row.original.id,
                    row.original,
                    setLoading,
                    showToast,
                    fetchSupplementsList
                  );
                }}
              >
                Mark as Active
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={() => {
                  handleSupplementStatus(
                    "Inactive",
                    row.original.id,
                    row.original,
                    setLoading,
                    showToast,
                    fetchSupplementsList
                  );
                }}
              >
                Mark as Inactive
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
