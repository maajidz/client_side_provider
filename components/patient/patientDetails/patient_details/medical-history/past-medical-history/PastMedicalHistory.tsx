import PastMedicalHistoryDialog from "@/components/charts/Encounters/Details/PastMedicalHistory/PastMedicalHistoryDialog";
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";
import { getPastMedicalHistory } from "@/services/chartDetailsServices";
import { PastMedicalHistoryInterface } from "@/services/pastMedicalHistoryInterface";
import { useCallback, useEffect, useState } from "react";
import { columns } from "./column";

interface PastMedicalHistoryProps {
  userDetailsId: string;
}

function PastMedicalHistory({ userDetailsId }: PastMedicalHistoryProps) {
  // Past Medical History State
  const [data, setData] = useState<PastMedicalHistoryInterface[]>([]);

  // Dialog State
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Loading State
  const [loading, setLoading] = useState(false);

  // Pagination Data
  const itemsPerPage = 3;
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
      <div className="flex gap-4 text-lg font-semibold flex-col">
        <div className="flex flex-row items-center gap-4">
          <PastMedicalHistoryDialog
            userDetailsId={userDetailsId}
            isOpen={isOpen}
            onClose={() => {
              setIsOpen(false);
              fetchPastMedicalHistory();
            }}
          />
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <DefaultDataTable
            title="Past Medical History"
            onAddClick={() => {
              setIsOpen(true);
            }}
            columns={columns()}
            data={data || []}
            pageNo={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        )}
      </div>
    </div>
  );
}

export default PastMedicalHistory;
