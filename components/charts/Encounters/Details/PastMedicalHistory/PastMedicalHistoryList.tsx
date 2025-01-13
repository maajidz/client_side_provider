import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  deletePastMedicalHistory,
  getPastMedicalHistory,
} from "@/services/chartDetailsServices";
import { PastMedicalHistoryInterface } from "@/services/pastMedicalHistoryInterface";
import { UserEncounterData } from "@/types/chartsInterface";
import { showToast } from "@/utils/utils";
import { Trash2Icon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import EditPastMedicalHistory from "./EditPastMedicalHistory";

interface PastMedicalHistoryListProps {
  patientDetails: UserEncounterData;
}

function PastMedicalHistoryList({
  patientDetails,
}: PastMedicalHistoryListProps) {
  // Data State
  const [medicalHistory, setMedicalHistory] = useState<
    PastMedicalHistoryInterface[]
  >([]);

  // Loading State
  const [loading, setLoading] = useState(false);

  // Error State
  const [error, setError] = useState("");

  // Toast State
  const { toast } = useToast();

  // GET Past Medical History
  const fetchPastMedicalHistory = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getPastMedicalHistory({
        userDetailsId: patientDetails.userDetails.id,
      });

      if (response) {
        setMedicalHistory(response.items);
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
  }, [patientDetails.userDetails.id]);

  // DELETE Past Medical History
  async function handleDeletePastMedicalHistory(id: string) {
    setLoading(true);

    try {
      await deletePastMedicalHistory({ id });

      showToast({
        toast,
        type: "success",
        message: `Medical history deleted successfully`,
      });
    } catch (err) {
      if (err instanceof Error)
        showToast({
          toast,
          type: "error",
          message: `Could not delete medical history`,
        });
    } finally {
      setLoading(false);
      fetchPastMedicalHistory();
    }
  }

  // Effects
  useEffect(() => {
    fetchPastMedicalHistory();
  }, [fetchPastMedicalHistory]);

  if (loading) return <LoadingButton />;

  if (error)
    return <div className="flex items-center justify-center">{error}</div>;

  return (
    <>
      {medicalHistory && medicalHistory.length > 0 ? (
        medicalHistory.map((history) => (
          <div
            key={history.id}
            className="flex flex-col gap-2 border rounded-md p-2"
          >
            <div className="flex justify-between items-center">
              <h5 className="text-lg font-semibold">{history.notes}</h5>
              <div className="flex items-center">
                <EditPastMedicalHistory
                  patientDetails={patientDetails}
                  selectedMedicaHistory={history}
                  fetchPastMedicalHistory={fetchPastMedicalHistory}
                />
                <Button
                  variant="ghost"
                  disabled={loading}
                  onClick={() => handleDeletePastMedicalHistory(history.id)}
                >
                  <Trash2Icon color="#84012A" />
                </Button>
              </div>
            </div>
            <span className="text-sm text-gray-700">
              {history.glp_refill_note_practice}
            </span>
          </div>
        ))
      ) : (
        <div className="flex items-center justify-center">
          No history available
        </div>
      )}
    </>
  );
}

export default PastMedicalHistoryList;
