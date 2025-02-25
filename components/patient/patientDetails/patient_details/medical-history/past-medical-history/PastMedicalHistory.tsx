import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
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
  // const [isOpen, setIsOpen] = useState(false);

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
    <div className="flex flex-col gap-6">
        {/* <PastMedicalHistoryDialog
          userDetailsId={userDetailsId}
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false);
            fetchPastMedicalHistory();
          }}
        /> */}
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-row justify-between items-center">
            <div className='flex flex-row gap-2 items-center'>
              <span className='font-bold text-lg'>Past Medical History</span>
              <Button variant="ghost"> Add </Button>
            </div>
            <div className="flex items-center justify-end gap-2">
              <div className="text-sm text-gray-400 font-semibold">
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
          </div>
          {loading ? (
            <LoadingButton />
          ) : (
            data.map((history) => (
              <div className="flex flex-col gap-3  border rounded-lg p-4" key={history.id}>
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
