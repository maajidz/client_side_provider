import FamilyHistoryDialog from "@/components/charts/Encounters/Details/FamilyHistory/FamilyHistoryDialog";
import { getFamilyHistoryData } from "@/services/chartDetailsServices";
import { FamilyHistoryResponseInterface } from "@/types/familyHistoryInterface";
import { useCallback, useEffect, useState } from "react";
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";
import { columns } from "./column";

interface FamilyHistoryProps {
  userDetailsId: string;
}

function FamilyHistory({ userDetailsId }: FamilyHistoryProps) {
  // Family History State
  const [data, setData] = useState<FamilyHistoryResponseInterface[]>([]);

  // Loading State
  const [loading, setLoading] = useState(false);

  // Pagination Data
  const itemsPerPage = 3;
  const [page, setPage] = useState(1);
  const [totalPages] = useState(1);

  // Dialog State
  const [isOpen, setIsOpen] = useState(false);

  // GET Family History Data
  const fetchFamilyHistory = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getFamilyHistoryData({
        userDetailsId,
        limit: itemsPerPage,
        page,
      });

      if (response) {
        setData(response);
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
    fetchFamilyHistory();
  }, [fetchFamilyHistory]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-4 text-lg font-semibold flex-col">
        <div className="flex flex-row items-center gap-4">
          <FamilyHistoryDialog
            userDetailsId={userDetailsId}
            isOpen={isOpen}
            onClose={() => {
              setIsOpen(false);
              fetchFamilyHistory();
            }}
          />
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <DefaultDataTable
            title={"Family History"}
            onAddClick={() => setIsOpen(true)}
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

export default FamilyHistory;
