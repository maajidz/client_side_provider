import LoadingButton from "@/components/LoadingButton";
import { getFamilyHistoryData } from "@/services/chartDetailsServices";
import { FamilyHistoryResponseInterface } from "@/types/familyHistoryInterface";
import { columns } from "./column";
import { useCallback, useEffect, useState } from "react";
import { CustomDataTable } from "@/components/custom_buttons/table/CustomDataTable";

interface FamilyHistoryClientProps {
  userDetailsId: string;
}

function FamilyHistoryClient({ userDetailsId }: FamilyHistoryClientProps) {
  // Family History State
  const [data, setData] = useState<FamilyHistoryResponseInterface[]>([]);

  // Loading State
  const [loading, setLoading] = useState(false);

  // Pagination Data
  const itemsPerPage = 5;
  const [page, setPage] = useState(1);
  const [totalPages] = useState(1);

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

  if (loading) return <LoadingButton />;

  return (
    <CustomDataTable
      columns={columns()}
      data={data || []}
      pageNo={page}
      totalPages={totalPages}
      onPageChange={(newPage) => setPage(newPage)}
    />
  );
}

export default FamilyHistoryClient;

