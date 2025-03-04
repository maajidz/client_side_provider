"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteUserPrescriptionsData } from "@/services/prescriptionsServices";
import { PrescriptionDataInterface } from "@/types/prescriptionInterface";
import { Ellipsis } from "lucide-react";
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
    cell: ({ row }) => (
      <div className="flex flex-col gap-1 cursor-pointer">
        <div className="text-sm font-semibold">{row.getValue("drug_name")}</div>
        <div>
          {row?.original?.dosages?.map((dosage, index) => (
            <div key={dosage?.id}>
              {index === 0 ? <></> : <span>,</span>}
              <span>
                {dosage.dosage_quantity} {dosage.dosage_unit} {dosage.frequency}{" "}
                for {dosage.duration_quantity} {dosage.dosage_unit}{" "}
              </span>
            </div>
          ))}
        </div>
        <div>
          Dispense: {row.original?.dispense_quantity}{" "}
          {row.original?.dispense_unit}
        </div>
        <div>Refill: {row.original?.earliest_fill_date}</div>
        <div>Supply: {row.original?.days_of_supply}</div>
        
      </div>
    ),
  },
  {
    accessorKey: "fromDate",
    header: "From Date",
    cell: ({ row }) => (
      <div className="cursor-pointer">
        {new Date(row.original.fromDate).toDateString()}
      </div>
    ),
  },
  {
    accessorKey: "toDate",
    header: "To Date",
    cell: ({ row }) => (
      <div className="cursor-pointer">
        {new Date(row.original.toDate).toDateString()}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={`${
          row.original.status === "active" ? "success" : "warning"
        }`}
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
            <DropdownMenuItem>Mark as Inactive</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
