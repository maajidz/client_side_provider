import { DataTable } from "@/components/ui/data-table";
import { PastMedicalHistoryInterface } from "@/services/pastMedicalHistoryInterface";
import { columns } from "./column";
import { useCallback, useEffect, useState } from "react";
import { getPastMedicalHistory } from "@/services/chartDetailsServices";
import LoadingButton from "@/components/LoadingButton";

interface PastMedicalHistoryClientProps {
  userDetailsId: string;
}

function PastMedicalHistoryClient({
  userDetailsId,
}: PastMedicalHistoryClientProps) {
  // Past Medical History State
  const [data, setData] = useState<PastMedicalHistoryInterface[]>([]);

  // Loading State
  const [loading, setLoading] = useState(false);

  // Pagination Data
  const itemsPerPage = 5;
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // GET Past Medical History Data
  const fetchPastMedicalHistory = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getPastMedicalHistory({
        userDetailsId,
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
  }, [userDetailsId]);

  useEffect(() => {
    fetchPastMedicalHistory();
  }, [fetchPastMedicalHistory]);

  if (loading) return <LoadingButton />;

  return (
    <DataTable
      searchKey="past"
      columns={columns()}
      data={data}
      pageNo={page}
      totalPages={totalPages}
      onPageChange={(newPage) => setPage(newPage)}
    />
  );
}

export default PastMedicalHistoryClient;
