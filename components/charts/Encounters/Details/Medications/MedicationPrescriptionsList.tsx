import LoadingButton from "@/components/LoadingButton";
import { Badge } from "@/components/ui/badge";
import { getMedicationPrescription } from "@/services/chartDetailsServices";
import { MedicationPrescriptionInterface } from "@/types/medicationInterface";
import { useCallback, useEffect, useState } from "react";

function MedicationPrescriptionsList() {
  // Data State
  const [prescriptionsData, setPrescriptionsData] = useState<
    MedicationPrescriptionInterface[]
  >([]);

  // Loading State
  const [loading, setLoading] = useState(false);

  // Error State
  const [error, setError] = useState("");

  const fetchPrescriptionData = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getMedicationPrescription();

      if (response) {
        setPrescriptionsData(response.result);
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
  }, []);

  useEffect(() => {
    fetchPrescriptionData();
  }, [fetchPrescriptionData]);

  if (loading) return <LoadingButton />;

  if (error)
    return <div className="flex items-center justify-center">{error}</div>;

  return (
    <div>
      {prescriptionsData && prescriptionsData.length > 0 ? (
        prescriptionsData.map((prescription) => (
          <div key={prescription.id} className="flex flex-col gap-2 border p-2">
            <h5 className="text-lg font-semibold">
              {prescription?.medicationName.productName}
            </h5>
            <span className="text-sm text-gray-700">
              <span className="font-semibold">
                {prescription.medicationName.strength}
              </span>{" "}
              <span>{prescription.medicationName.doseForm},</span>{" "}
              <span className="capitalize">
                {prescription.medicationName.route}
              </span>
            </span>
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
        ))
      ) : (
        <div className="flex items-center justify-center">
          No tasks available
        </div>
      )}
    </div>
  );
}

export default MedicationPrescriptionsList;









