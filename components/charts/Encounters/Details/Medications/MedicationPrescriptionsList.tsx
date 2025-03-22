import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  deleteMedicationPrescription,
  getMedicationPrescription,
} from "@/services/chartDetailsServices";
import { MedicationPrescriptionInterface } from "@/types/medicationInterface";
import { showToast } from "@/utils/utils";
import { EllipsisVertical } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import EditMedicationPrescription from "./EditMedicationPrescription";
import AccordionShimmerCard from "@/components/custom_buttons/shimmer/AccordionCardShimmer";
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function MedicationPrescriptionsList() {
  // Data State
  const [prescriptionsData, setPrescriptionsData] = useState<
    MedicationPrescriptionInterface[]
  >([]);

  // Loading State
  const [loading, setLoading] = useState(false);

  // Error State
  const [error, setError] = useState("");

  // Pagination State
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 3;

  // Toast State
  const { toast } = useToast();

  // GET Medication Prescriptions
  const fetchPrescriptionData = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getMedicationPrescription({
        page: page,
        limit: limit,
      });

      if (response) {
        setPrescriptionsData(response.result);
        setTotalPages(Math.ceil(response.total / limit));
      }
    } catch (err) {
      if (err instanceof Error) {
        setError("Something went wrong");
      } else {
        setError("Something went wrong. Unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }, [page]);

  // Effects
  useEffect(() => {
    fetchPrescriptionData();
  }, [fetchPrescriptionData]);

  // Delete Selected Medication
  async function handleDeleteMedicationPrescription(
    medicationPrescriptionId: string
  ) {
    setLoading(true);

    try {
      await deleteMedicationPrescription({ medicationPrescriptionId });

      showToast({
        toast,
        type: "success",
        message: `Prescription deleted successfully`,
      });
    } catch (err) {
      if (err instanceof Error)
        showToast({
          toast,
          type: "error",
          message: `Prescription delete failed`,
        });
    } finally {
      setLoading(false);
      fetchPrescriptionData();
    }
  }

  // Define columns for the medications table
  const columns: ColumnDef<MedicationPrescriptionInterface>[] = [
    {
      accessorKey: "medicationName.productName",
      header: "Medication",
      cell: ({ row }) => (
        <div className="cursor-pointer font-semibold">
          {row.original.medicationName?.productName}
        </div>
      ),
    },
    {
      accessorKey: "medicationDetails",
      header: "Details",
      cell: ({ row }) => (
        <div className="cursor-pointer text-sm text-gray-700">
          <span className="font-semibold">
            {row.original.medicationName.strength}
          </span>{" "}
          <span>{row.original.medicationName.doseForm},</span>{" "}
          <span className="capitalize">
            {row.original.medicationName.route}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "directions",
      header: "Directions",
      cell: ({ row }) => (
        <div className="cursor-pointer">
          {row.original.directions}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          className={`w-fit px-2 py-0.5 text-md rounded-full border-[1px] ${
            row.original.status.toLowerCase() === "active"
              ? "bg-[#ABEFC6] text-[#067647] border-[#067647] hover:bg-[#ABEFC6]"
              : "bg-[#FECDCA] text-[#B42318] border-[#B42318] hover:bg-[#FECDCA]"
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
              <EllipsisVertical size={16} className="text-gray-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <EditMedicationPrescription
                  selectedPrescription={row.original}
                  fetchPrescriptionData={fetchPrescriptionData}
                />
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteMedicationPrescription(row.original.id)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  if (error)
    return <div className="flex items-center justify-center">{error}</div>;

  return (
    <>
      {loading ? (
        <AccordionShimmerCard />
      ) : prescriptionsData && prescriptionsData.length > 0 ? (
        <div className="flex flex-col gap-2">
          <DefaultDataTable
            // title="Medications"
            columns={columns}
            data={prescriptionsData}
            pageNo={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
            className="mt-4"
          />
        </div>
      ) : (
        <div className="flex items-center justify-center">
          No medication available
        </div>
      )}
    </>
  );
}

export default MedicationPrescriptionsList;
