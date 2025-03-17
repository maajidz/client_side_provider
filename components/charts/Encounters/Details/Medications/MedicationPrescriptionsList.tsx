
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  deleteMedicationPrescription,
  getMedicationPrescription,
} from "@/services/chartDetailsServices";
import { MedicationPrescriptionInterface } from "@/types/medicationInterface";
import { showToast } from "@/utils/utils";
import { ChevronLeft, ChevronRight, Trash2Icon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import EditMedicationPrescription from "./EditMedicationPrescription";
import AccordionShimmerCard from "@/components/custom_buttons/shimmer/AccordionCardShimmer";

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

  if (error)
    return <div className="flex items-center justify-center">{error}</div>;

  return (
    <>
      {loading ? (
        <AccordionShimmerCard />
      ) : prescriptionsData && prescriptionsData.length > 0 ? (
        <div className="flex flex-col gap-2">
          <div className="space-x-2 self-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
            >
              <ChevronRight />
            </Button>
          </div>
          {prescriptionsData.map((prescription) => (
            <div
              key={prescription.id}
              className="flex flex-col gap-2 border rounded-md p-2"
            >
              <div className="flex justify-between items-center">
                <h5 className="text-lg font-semibold">
                  {prescription?.medicationName?.productName}
                </h5>
                <div className="flex items-center">
                  <EditMedicationPrescription
                    selectedPrescription={prescription}
                    fetchPrescriptionData={fetchPrescriptionData}
                  />
                  <Button
                    variant="ghost"
                    onClick={() =>
                      handleDeleteMedicationPrescription(prescription.id)
                    }
                    disabled={loading}
                  >
                    <Trash2Icon color="#84012A" />
                  </Button>
                </div>
              </div>
              <span className="text-sm text-gray-700">
                <span className="font-semibold">
                  {prescription.medicationName.strength}
                </span>{" "}
                <span>{prescription.medicationName.doseForm},</span>{" "}
                <span className="capitalize">
                  {prescription.medicationName.route}
                </span>
              </span>
              <span className="text-md">{prescription.directions}</span>
              <Badge
                className={`w-fit px-2 py-0.5 text-md rounded-full border-[1px] ${
                  prescription.status.toLowerCase() === "active"
                    ? "bg-[#ABEFC6] text-[#067647] border-[#067647] hover:bg-[#ABEFC6]"
                    : "bg-[#FECDCA] text-[#B42318] border-[#B42318] hover:bg-[#FECDCA]"
                }`}
              >
                {prescription.status}
              </Badge>
            </div>
          ))}
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
