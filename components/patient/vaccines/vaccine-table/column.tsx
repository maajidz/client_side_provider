import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteHistoricalVaccine } from "@/services/chartDetailsServices";
import { HistoricalVaccineInterface } from "@/types/chartsInterface";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";

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
        <h6 className="text-md font-semibold">{row.original.vaccine_name}</h6>
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Historical Source</span>{" "}
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
      <div
        className={`cursor-pointer ${
          row.original.status === "pending"
            ? "text-yellow-500"
            : "text-green-500"
        }`}
      >
        {row.original.status.toUpperCase()}
      </div>
    ),
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
