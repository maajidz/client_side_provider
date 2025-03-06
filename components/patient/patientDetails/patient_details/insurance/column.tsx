"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { InsuranceResponse } from "@/types/insuranceInterface";
import { deleteInsuranceData } from "@/services/insuranceServices";
import { Badge } from "@/components/ui/badge";

const handleDeleteInsuranceData = async (
  insuranceDataId: string,
  setLoading: (loading: boolean) => void,
  showToast: (args: { type: string; message: string }) => void,
  fetchInsuranceData: () => void
) => {
  setLoading(true);
  try {
    await deleteInsuranceData({ id: insuranceDataId });
    showToast({
      type: "success",
      message: "Insurance data deleted successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      showToast({
        type: "error",
        message: "Failed to delete insurance data",
      });
    } else {
      showToast({
        type: "error",
        message: "Failed to delete insurance data. An unknown error occurred",
      });
    }
  } finally {
    setLoading(false);
    fetchInsuranceData();
  }
};

export const columns = ({
  setIsDialogOpen,
  setSelectedInsurance,
  setLoading,
  showToast,
  fetchInsuranceData,
  setIsOpenNotesDialog,
}: {
  setIsDialogOpen: (isOpen: boolean) => void;
  setSelectedInsurance: (insuranceData: InsuranceResponse | null) => void;
  setLoading: (loading: boolean) => void;
  showToast: (args: { type: string; message: string }) => void;
  setIsOpenNotesDialog: (isOpen: boolean) => void;
  fetchInsuranceData: () => void;
}): ColumnDef<InsuranceResponse>[] => [
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("type")}</div>
    ),
  },
  {
    accessorKey: "companyName",
    header: "Company Name",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("companyName")}</div>
    ),
  },
  {
    accessorKey: "groupNameOrNumber",
    header: "Group Name or Number",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("groupNameOrNumber")}</div>
    ),
  },
  {
    accessorKey: "subscriberNumber",
    header: "Subscriber Number",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("subscriberNumber")}</div>
    ),
  },
  {
    accessorKey: "idNumber",
    header: "ID Number",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("idNumber")}</div>
    ),
  },
  // {
  //   accessorKey: "dueDate",
  //   header: "Due Date",
  //   cell: ({ getValue }) => {
  //     const dob = getValue() as string;
  //     const date = new Date(dob);
  //     return (
  //       <div className="cursor-pointer">
  //         {date.toLocaleDateString("en-US", {
  //           month: "short",
  //           day: "2-digit",
  //           year: "numeric",
  //         })}
  //       </div>
  //     );
  //   },
  // },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={`${row.original.status === "active" ? "success" : "default"}`}
      >
        {row.getValue("status")}
      </Badge>
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
            <DropdownMenuItem
              onClick={() => {
                setSelectedInsurance(row.original);
                setIsDialogOpen(true);
              }}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setIsOpenNotesDialog(true)}
            >
              Add/View Notes
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                handleDeleteInsuranceData(
                  row.original.id,
                  setLoading,
                  showToast,
                  fetchInsuranceData
                );
              }}
            >
              Delete
            </DropdownMenuItem>
            {row.original.status === "inactive" ? (
              <DropdownMenuItem className="cursor-pointer">
                Mark as Active
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem className="cursor-pointer">
                Mark as Inactive
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
