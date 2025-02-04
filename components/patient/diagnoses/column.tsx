import {
  DropdownMenuContent,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { deleteDiagnoses } from "@/services/chartsServices";
import { DiagnosesInterface } from "@/types/chartsInterface";
import { ColumnDef } from "@tanstack/react-table";
import { Ellipsis } from "lucide-react";

const handleDiagnosisDelete = async (
  diagnosisId: string,
  setLoading: (loading: boolean) => void,
  showToast: (args: { type: string; message: string }) => void,
  fetchRecalls: () => void
) => {
  setLoading(true);
  try {
    await deleteDiagnoses({ diagnosisId });
    showToast({
      type: "success",
      message: "Recalls deleted successfully",
    });
    fetchRecalls();
  } catch (error) {
    console.error("Error:", error);
    showToast({ type: "error", message: "Failed to delete recall" });
  } finally {
    setLoading(false);
  }
};

export const columns = ({
  setEditData,
  setIsDialogOpen,
  setLoading,
  showToast,
  fetchDiagnoses,
}: {
  setEditData: (data: DiagnosesInterface | undefined) => void;
  setIsDialogOpen: (value: boolean) => void;
  setLoading: (loading: boolean) => void;
  showToast: (args: { type: string; message: string }) => void;
  fetchDiagnoses: () => void;
}): ColumnDef<DiagnosesInterface>[] => [
  {
    accessorKey: "diagnosis_name",
    header: "Diagnosis Name",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("diagnosis_name")}</div>
    ),
  },
  {
    accessorKey: "ICD_Code",
    header: "ICD Code",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("ICD_Code")}</div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "From Date",
    cell: ({ row }) => (
      <div className="cursor-pointer">
        {new Date(row.getValue("createdAt")).toDateString()}
      </div>
    ),
  },
  {
    accessorKey: "",
    header: "To Date",
    cell: () => <div className="cursor-pointer"></div>,
  },
  {
    accessorKey: "",
    header: "Status",
    cell: () => <div className="cursor-pointer"></div>,
  },
  {
    accessorKey: "id",
    header: "",
    cell: ({ row }) => (
      <div className="cursor-pointer">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Ellipsis />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setEditData(row.original)
                setIsDialogOpen(true);
              }}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                handleDiagnosisDelete(
                  row.original.id,
                  setLoading,
                  showToast,
                  fetchDiagnoses
                )
              }
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];

