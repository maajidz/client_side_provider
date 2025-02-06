import GhostButton from "@/components/custom_buttons/GhostButton";
import PastMedicalHistoryDialog from "@/components/charts/Encounters/Details/PastMedicalHistory/PastMedicalHistoryDialog";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PastMedicalHistoryInterface } from "@/services/pastMedicalHistoryInterface";
import { getPastMedicalHistory } from "@/services/chartDetailsServices";
import LoadingButton from "@/components/LoadingButton";

interface PastMedicalHistoryProps {
  userDetailsId: string;
}

function PastMedicalHistory({ userDetailsId }: PastMedicalHistoryProps) {
  // Dialog State
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<PastMedicalHistoryInterface[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPastMedicalHistory = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getPastMedicalHistory({
        userDetailsId,
      });

      if (response) {
        setData(response.items);
      }
    } catch (err) {
      if (err instanceof Error) {
        console.log("Error", err);
      }
    } finally {
      setLoading(false);
    }
  }, [userDetailsId]);

  useEffect(() => {
    fetchPastMedicalHistory();
  }, [fetchPastMedicalHistory]);

  if (loading) return <LoadingButton />;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center p-4 text-lg font-semibold rounded-md bg-[#f0f0f0]">
        <span>Past Medical History</span>
        <GhostButton label="Add" onClick={() => setIsOpen(true)} />
        <PastMedicalHistoryDialog
          userDetailsId={userDetailsId}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </div>
      <ScrollArea className="h-[12.5rem] min-h-10">
        <div className="flex flex-1 flex-col p-3 border rounded-lg m-3">
          {data.map((history) => (
            <div className="flex flex-col gap-3" key={history.id}>
              <div className="font-semibold text-large">
                Past Medical History on{" "}
                {new Date(history.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })}{" "}
              </div>
              <div>
                <div>{history.notes}</div>
                <div>{history.glp_refill_note_practice}</div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

export default PastMedicalHistory;
