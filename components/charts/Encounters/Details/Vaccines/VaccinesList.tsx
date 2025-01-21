import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  deleteHistoricalVaccine,
  getHistoricalVaccine,
} from "@/services/chartDetailsServices";
import {
  HistoricalVaccineInterface,
  UserEncounterData,
} from "@/types/chartsInterface";
import { showToast } from "@/utils/utils";
import { Trash2Icon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface VaccinesListProps {
  patientDetails: UserEncounterData;
  // onDialogOpen: (open: boolean) => void;
}

function VaccinesList({ patientDetails }: VaccinesListProps) {
  // Historical Vaccine State
  const [historicalVaccineData, setHistoricalVaccineData] = useState<
    HistoricalVaccineInterface[]
  >([]);
  console.log(patientDetails);

  // Loading State
  const [loading, setLoading] = useState(false);

  // Error State
  const [error, setError] = useState("");

  // Toast State
  const { toast } = useToast();

  // GET Historical Vaccine Data
  const fetchHistoricalVaccine = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getHistoricalVaccine({ userDetailsId: "" });

      if (response) {
        setHistoricalVaccineData(response.data);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError("Could not fetch vaccines data");
      } else {
        setError("Could not fetch vaccines data. Unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  }, []);

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
      fetchHistoricalVaccine();
    }
  };

  // Effects
  useEffect(() => {
    fetchHistoricalVaccine();
  }, [fetchHistoricalVaccine]);

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
                  {/* <Button variant="ghost" onClick={() => onDialogOpen(true)}>
                    <Edit2Icon color="#84012A" />
                  </Button> */}
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
              <p>Source: {vaccine.source}</p>
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

