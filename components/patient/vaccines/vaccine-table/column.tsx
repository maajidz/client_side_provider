import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";
import { deleteHistoricalVaccine } from "@/services/chartDetailsServices";
import { HistoricalVaccineInterface } from "@/types/chartsInterface";
import { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";

const handleDeleteVaccine = async (
  vaccineId: string,
  setLoading: (loading: boolean) => void,
  showToast: (args: { type: string; message: string }) => void,
  fetchHistoricalVaccine: () => void
) => {
  setLoading(true);
  try {
    await deleteHistoricalVaccine({ id: vaccineId });
    showToast({
      type: "success",
      message: "Allergy deleted successfully",
    });
    fetchHistoricalVaccine();
  } catch (error) {
    console.error("Error:", error);
    showToast({ type: "error", message: "Failed to delete Allergy" });
  } finally {
    setLoading(false);
  }
};

export const columns = ({
  setEditData,
  setIsVaccinesDialogOpen,
  setLoading,
  showToast,
  fetchHistoricalVaccine,
}: {
  setEditData: (data: HistoricalVaccineInterface) => void;
  setIsVaccinesDialogOpen: (isOpen: boolean) => void;
  setLoading: (loading: boolean) => void;
  showToast: (args: { type: string; message: string }) => void;
  fetchHistoricalVaccine: () => void;
}): ColumnDef<HistoricalVaccineInterface>[] => [
  {
    accessorKey: "vaccine_name",
    header: "Vaccine Name",
    cell: ({ row }) => (
      <div className="flex flex-col gap-2 cursor-pointer">
        <div className="flex items-center gap-2 text-md font-semibold">
          <h6>{row.original.vaccine_name}</h6>
          <span className="text-gray-500">( #{row.original.in_series} )</span>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="source" />{" "}
          <span className="font-semibold">
            {row.original.source === ""
              ? "Source not specified"
              : row.original.source}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "date",
    header: "DateTime",
    cell: ({ row }) => (
      <div className="cursor-pointer">
        {new Date(row.original.date).toLocaleDateString()}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={`${
          row.original.status === "pending"
            ? "warning"
            : "success"
        }`}
      >
        {row.original.status.toUpperCase()}
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
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setEditData(row.original);
                setIsVaccinesDialogOpen(true);
              }}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                handleDeleteVaccine(
                  row.original.id,
                  setLoading,
                  showToast,
                  fetchHistoricalVaccine
                );
                fetchHistoricalVaccine();
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
