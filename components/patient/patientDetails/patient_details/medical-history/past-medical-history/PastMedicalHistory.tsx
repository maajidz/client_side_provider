import LoadingButton from "@/components/LoadingButton";
import GhostButton from "@/components/custom_buttons/buttons/GhostButton";
import PastMedicalHistoryDialog from "@/components/charts/Encounters/Details/PastMedicalHistory/PastMedicalHistoryDialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getPastMedicalHistory } from "@/services/chartDetailsServices";
import { PastMedicalHistoryInterface } from "@/services/pastMedicalHistoryInterface";
import { useCallback, useEffect, useState } from "react";

interface PastMedicalHistoryProps {
  userDetailsId: string;
}

function PastMedicalHistory({ userDetailsId }: PastMedicalHistoryProps) {
  // Past Medical History State
  const [data, setData] = useState<PastMedicalHistoryInterface[]>([]);

  // Loading State
  const [loading, setLoading] = useState(false);

  // Pagination Data
  const itemsPerPage = 3;
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Dialog State
  const [isOpen, setIsOpen] = useState(false);

  // GET Past Medical History Data
  const fetchPastMedicalHistory = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getPastMedicalHistory({
        userDetailsId,
        page: page,
        limit: itemsPerPage,
      });

      if (response) {
        setData(response.items);
        setTotalPages(Math.ceil(response.total / itemsPerPage));
      }
    } catch (err) {
      if (err instanceof Error) {
        console.log("Error", err);
      }
    } finally {
      setLoading(false);
    }
  }, [userDetailsId, page]);

  useEffect(() => {
    fetchPastMedicalHistory();
  }, [fetchPastMedicalHistory]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-4 items-center text-lg font-semibold">
        <span>Past Medical History</span>
        <Button variant="ghost" onClick={() => setIsOpen(true)}>Add</Button>
        <PastMedicalHistoryDialog
          userDetailsId={userDetailsId}
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false);
            fetchPastMedicalHistory();
          }}
        />
      </div>
        <div className="flex flex-1 flex-col p-3 border rounded-lg">
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
              >
                Next
              </Button>
            </div>
          </div>
          {loading ? (
            <LoadingButton />
          ) : (
            data.map((history) => (
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
            ))
          )}
        </div>
    </div>
  );
}

export default PastMedicalHistory;
