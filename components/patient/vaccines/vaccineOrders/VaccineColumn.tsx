import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteVaccineOrder } from "@/services/injectionsServices";
import { VaccinesInterface } from "@/types/injectionsInterface";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";

const handleDeleteVaccineOrder = async (
  vaccineOrderId: string,
  setLoading: (loading: boolean) => void,
  showToast: (args: { type: string; message: string }) => void,
  fetchVaccineOrderData: () => void
) => {
  setLoading(true);
  try {
    await deleteVaccineOrder({ vaccineOrderId: vaccineOrderId });
    showToast({
      type: "success",
      message: "Allergy deleted successfully",
    });
    fetchVaccineOrderData();
  } catch (error) {
    console.error("Error:", error);
    showToast({ type: "error", message: "Failed to delete Allergy" });
  } finally {
    setLoading(false);
  }
};

export const columns = ({
  setLoading,
  showToast,
  fetchVaccineOrderData,
}: {
  setLoading: (loading: boolean) => void;
  showToast: (args: { type: string; message: string }) => void;
  fetchVaccineOrderData: () => void;
}): ColumnDef<VaccinesInterface>[] => [
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
        <span
          className={
            row.original.status.trim().toLowerCase() === "pending"
              ? "text-yellow-500 font-semibold cursor-pointer"
              : "text-green-500 font-semibold cursor-pointer"
          }
        >
          {row.original.status.toUpperCase()}
        </span>
      );
    },
  },
  {
    accessorKey: "id",
    header: "",
    cell: ({ row }) => (
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <DotsHorizontalIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => {
                handleDeleteVaccineOrder(
                  row.original.id,
                  setLoading,
                  showToast,
                  fetchVaccineOrderData
                );
                fetchVaccineOrderData();
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
