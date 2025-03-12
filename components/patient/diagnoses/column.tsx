import { Badge } from "@/components/ui/badge";
import {
  DropdownMenuContent,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { deleteDiagnoses, updateDiagnoses } from "@/services/chartsServices";
import {
  DiagnosesInterface,
  UpdateDiagnosesRequestBody,
} from "@/types/chartsInterface";
import { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";

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

const handleDiagnosisStatus = async (
  status: "active" | "inactive",
  id: string,
  diagnosisData: DiagnosesInterface,
  setLoading: (loading: boolean) => void,
  showToast: (args: { type: string; message: string }) => void,
  fetchSupplements: () => void
) => {
  setLoading(true);
  const requestData: UpdateDiagnosesRequestBody = {
    diagnosis_Id: diagnosisData?.diagnosis_Id ?? "",
    // ICD_Code: diagnosisData?.ICD_Code,
    notes: diagnosisData.notes,
    status: status,
    fromDate: diagnosisData.fromDate,
    toDate: diagnosisData.toDate,
  };
  try {
    await updateDiagnoses({
      requestData: requestData,
      diagnosisId: id,
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
  fetchDiagnoses,
}: {
  setEditData: (data: DiagnosesInterface | null) => void;
  setIsDialogOpen: (value: boolean) => void;
  setLoading: (loading: boolean) => void;
  showToast: (args: { type: string; message: string }) => void;
  fetchDiagnoses: () => void;
}): ColumnDef<DiagnosesInterface>[] => [
  {
    accessorKey: "diagnosisType",
    header: "Diagnosis Name",
    cell: ({ row }) => (
      <div className="cursor-pointer flex flex-row gap-3">
        <div>{row.original.type.diagnosis_name}</div>
        <div>{row.original.type.ICD_Code}</div>
      </div>
    ),
  },
  {
    accessorKey: "fromDate",
    header: "From Date",
    cell: ({ row }) => (
      <div className="cursor-pointer">
        {new Date(row.getValue("fromDate")).toDateString()}
      </div>
    ),
  },
  {
    accessorKey: "toDate",
    header: "To Date",
    cell: ({ row }) => (
      <div className="cursor-pointer">
        {new Date(row.getValue("toDate")).toDateString()}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const statusColor =
        row.original.status === "active" ? "success" : "warning";

      return <Badge variant={`${statusColor}`}>{row.original.status}</Badge>;
    },
  },
  {
    accessorKey: "id",
    header: "",
    cell: ({ row }) => (
      <div className="cursor-pointer">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <EllipsisVertical size={16} className="text-gray-500" />
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
            {row.original.status === "Inactive" ? (
              <DropdownMenuItem
                onClick={() => {
                  handleDiagnosisStatus(
                    "active",
                    row.original.id,
                    row.original,
                    setLoading,
                    showToast,
                    fetchDiagnoses
                  );
                }}
              >
                Mark as Active
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={() => {
                  handleDiagnosisStatus(
                    "inactive",
                    row.original.id,
                    row.original,
                    setLoading,
                    showToast,
                    fetchDiagnoses
                  );
                }}
              >
                Mark as Inactive
              </DropdownMenuItem>
            )}
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
