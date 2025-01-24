import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { deleteHistoricalVaccine } from "@/services/chartDetailsServices";
import { HistoricalVaccineInterface } from "@/types/chartsInterface";
import { showToast } from "@/utils/utils";
import { Edit2Icon, Trash2Icon } from "lucide-react";
import { useState } from "react";

interface VaccinesListProps {
  historicalVaccineData: HistoricalVaccineInterface[];
  error: string;
  onDialogOpen: (open: boolean) => void;
  onFetchHistoricalData: () => void;
  onSetVaccineData: (vaccineData: HistoricalVaccineInterface) => void;
}

function VaccinesList({
  historicalVaccineData,
  error,
  onDialogOpen,
  onFetchHistoricalData,
  onSetVaccineData,
}: VaccinesListProps) {
  // Loading State
  const [loading, setLoading] = useState(false);

  // Toast State
  const { toast } = useToast();

  // DELETE Historical Vaccine
  const handleDeleteHistoricalVaccine = async (id: string) => {
    setLoading(true);

    try {
      await deleteHistoricalVaccine({ id });

      showToast({
        toast,
        type: "success",
        message: "Historical vaccine deleted successfully",
      });
    } catch (err) {
      if (err instanceof Error) {
        showToast({
          toast,
          type: "error",
          message: "Could not delete historical vaccine",
        });
      } else {
        showToast({
          toast,
          type: "error",
          message:
            "Could not delete historical vaccine. Unknown error occurred",
        });
      }
    } finally {
      setLoading(false);
      onFetchHistoricalData();
    }
  };

  if (loading) return <LoadingButton />;

  return (
    <>
      {error ? (
        <p className="text-center">{error}</p>
      ) : historicalVaccineData.length > 0 ? (
        <ul>
          {historicalVaccineData.map((vaccine) => (
            <li key={vaccine.id} className="border-b py-2">
              <div className="flex justify-between items-center">
                <p className="font-bold">{vaccine.vaccine_name}</p>
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      onSetVaccineData(vaccine);
                      onDialogOpen(true);
                    }}
                  >
                    <Edit2Icon color="#84012A" />
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      handleDeleteHistoricalVaccine(vaccine?.id);
                    }}
                    disabled={loading}
                  >
                    <Trash2Icon color="#84012A" />
                  </Button>
                </div>
              </div>
              <p>Date: {vaccine.date}</p>
              <p>
                Source:{" "}
                {vaccine.source === ""
                  ? "Source not specified"
                  : vaccine.source}
              </p>
              <p>Notes: {vaccine.notes === "" ? "No notes" : vaccine.notes}</p>
              <p>
                # In Series:{" "}
                {vaccine.in_series === "" ? "Not specified" : vaccine.in_series}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center">No vaccine data available.</p>
      )}
    </>
  );
}

export default VaccinesList;

