import GhostButton from "@/components/custom_buttons/buttons/GhostButton";
import { Badge } from "@/components/ui/badge";
import { deleteVaccineOrder } from "@/services/injectionsServices";
import { VaccinesInterface } from "@/types/injectionsInterface";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2Icon } from "lucide-react";

const handleVaccineDelete = async (
  vaccineId: string,
  setLoading: (loading: boolean) => void,
  showToast: (args: { type: string; message: string }) => void,
  fetchVaccinesData: () => void
) => {
  setLoading(true);
  try {
    await deleteVaccineOrder({ vaccineOrderId: vaccineId });
    showToast({
      type: "success",
      message: "Vaccine order deleted successfully",
    });
    fetchVaccinesData();
  } catch (error) {
    console.error("Error:", error);
    showToast({ type: "error", message: "Failed to delete Vaccine order" });
  } finally {
    setLoading(false);
  }
};

export const columns = ({
  setLoading,
  showToast,
  fetchVaccinesData,
}: {
  setLoading: (loading: boolean) => void;
  showToast: (args: { type: string; message: string }) => void;
  fetchVaccinesData: () => void;
}): ColumnDef<VaccinesInterface>[] => [
  {
    accessorKey: "userDetails.user.firstName",
    header: "Patient",
    cell: ({ row }) => (
      <div className="cursor-pointer">
        {row.original.userDetails.user.firstName}{" "}
        {row.original.userDetails.user.lastName}
      </div>
    ),
  },
  {
    accessorKey: "vaccine_name",
    header: "Vaccine Name",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("vaccine_name")}</div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Ordered On",
    cell: ({ row }) => (
      <div className="cursor-pointer">
        {new Date(row.original.createdAt).toDateString()}
      </div>
    ),
  },
  {
    accessorKey: "providerName",
    header: "Ordered By",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("providerName")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Order Status",
    cell: ({ row }) => {
      return (
        <Badge
          variant={
            row.original.status.trim().toLowerCase() === "pending"
              ? "warning"
              : "success"
          }
        >
          {row.original.status.toUpperCase()}
        </Badge>
      );
    },
  },
  {
    accessorKey: "id",
    header: "",
    cell: ({ row }) => (
      <GhostButton
        onClick={() => {
          handleVaccineDelete(
            row.original.id,
            setLoading,
            showToast,
            fetchVaccinesData
          );
          fetchVaccinesData();
        }}
      >
        <Trash2Icon color="#84012A" />
      </GhostButton>
    ),
  },
];
