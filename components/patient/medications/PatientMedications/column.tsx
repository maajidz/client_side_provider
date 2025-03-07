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
  deleteUserPrescriptionsData,
  updateUserPrescription,
} from "@/services/prescriptionsServices";
import { PrescriptionDataInterface } from "@/types/prescriptionInterface";
import { EllipsisVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const handlePrescriptionDelete = async (
  prescriptionId: string,
  setLoading: (loading: boolean) => void,
  showToast: (args: { type: string; message: string }) => void,
  fetchSupplements: () => void
) => {
  setLoading(true);
  try {
    await deleteUserPrescriptionsData({ id: prescriptionId });
    showToast({
      type: "success",
      message: "Prescription deleted successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    showToast({ type: "error", message: "Failed to delete prescription" });
  } finally {
    setLoading(false);
    fetchSupplements();
  }
};

const handleStatusUpdate = async (
  requestData: PrescriptionDataInterface,
  prescriptionId: string,
  setLoading: (loading: boolean) => void,
  showToast: (args: { type: string; message: string }) => void,
  fetchPrescriptionData: () => void
) => {
  setLoading(true);
  try {
    await updateUserPrescription({ requestData, id: prescriptionId });
    showToast({
      type: "success",
      message: "Prescription status updated successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      showToast({
        type: "error",
        message: "Failed to update prescription status",
      });
    } else {
      showToast({
        type: "error",
        message:
          "Failed to update prescription status. An unknown error occurred",
      });
    }
  } finally {
    setLoading(false);
    fetchPrescriptionData();
  }
};

export const columns = ({
  setEditData,
  setIsDialogOpen,
  setLoading,
  showToast,
  fetchPrescriptionsList,
}: {
  setEditData: (data: PrescriptionDataInterface | undefined) => void;
  setIsDialogOpen: (isOpen: boolean) => void;
  setLoading: (loading: boolean) => void;
  showToast: (args: { type: string; message: string }) => void;
  fetchPrescriptionsList: () => void;
}): ColumnDef<PrescriptionDataInterface>[] => [
  {
    accessorKey: "drug_name",
    header: "Prescription",
    cell: ({ row }) => {
      const prescription: PrescriptionDataInterface = row.original;

      return (
        <div className="flex flex-col gap-1 text-[13px] font-medium cursor-pointer">
          <div className="font-semibold text-sm">{prescription.drug_name}</div>
          <div>{prescription.directions}{", "}for {prescription.days_of_supply} days</div>
          {/* <div>Dispense as Written: {prescription.dispense_as_written ? "Yes" : "No"}</div> */}
          {/* <div>Primary Diagnosis: {prescription.primary_diagnosis}</div> */}
          {/* <div>Secondary Diagnosis: {prescription.secondary_diagnosis}</div> */}
          <div>
           <span className="text-gray-600">Dispense:</span> {prescription.dispense_quantity} blisters, {prescription.dispense_unit}
          </div>
          <div><span className="text-gray-600">Refills:</span> {prescription.additional_refills}</div>
          {/* <div>Prior Authorization: {prescription.prior_auth}</div> */}
          {/* <div>Prior Auth Decision: {prescription.prior_auth_decision}</div> */}
          <div><span className="text-gray-600">Earliest Fill Date:</span> {new Date(prescription.earliest_fill_date).toLocaleDateString("en-US")}</div>
          <div><span className="text-gray-600">Internal Comments:</span> {prescription.internal_comments}</div>
          <div><span className="text-gray-600">Note to Pharmacy:</span> {prescription.Note_to_Pharmacy}</div>
          {/* <div>Created At: {new Date(prescription.createdAt).toLocaleDateString("en-US")}</div> */}
          {/* <div>Updated At: {new Date(prescription.updatedAt).toLocaleDateString("en-US")}</div> */}
        </div>
      );
    },
  },
  {
    accessorKey: "fromDate",
    header: "From Date",
    cell: ({ row }) => (
      <div>{new Date(row.original.fromDate).toLocaleDateString("en-US")}</div>
    ),
  },
  {
    accessorKey: "toDate",
    header: "To Date",
    cell: ({ row }) => (
      <div>{new Date(row.original.toDate).toLocaleDateString("en-US")}</div>
    ),
  },
  {
    accessorKey: "signed",
    header: "Signed",
    cell: ({ row }) => (
      <div>{row.original.status === "completed" ? "Yes" : "No"}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={`${row.original.status === "completed" ? "success" : "warning"}`}
      >
        {row.original.status}
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
<<<<<<< HEAD
            <EllipsisVertical size={16} className="text-gray-500"/>
=======
            <EllipsisVertical size={16} color="gray" />
>>>>>>> 5c353e5 (Added UI Styles - Badges, Indicators and Misc fixes)
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
                handlePrescriptionDelete(
                  row.original.id,
                  setLoading,
                  showToast,
                  fetchPrescriptionsList
                );
                fetchPrescriptionsList();
              }}
            >
              Delete
            </DropdownMenuItem>
            {row.original.status === "pending" ? (
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() =>
                  handleStatusUpdate(
                    { ...row.original, status: "completed" },
                    row.original.id,
                    setLoading,
                    showToast,
                    fetchPrescriptionsList
                  )
                }
              >
                Mark as Completed
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() =>
                  handleStatusUpdate(
                    { ...row.original, status: "pending" },
                    row.original.id,
                    setLoading,
                    showToast,
                    fetchPrescriptionsList
                  )
                }
              >
                Mark as Pending
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
