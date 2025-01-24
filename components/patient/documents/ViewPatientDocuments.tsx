import LoadingButton from "@/components/LoadingButton";
import { DataTable } from "@/components/ui/data-table";
import { getDocumentsData } from "@/services/documentsServices";
import { DocumentsInterface } from "@/types/documentsInterface";
import { columns } from "./column";
import { useCallback, useEffect, useState } from "react";

function ViewPatientDocuments({ userDetailsId }: { userDetailsId: string }) {
  const [documentsData, setDocumentsData] = useState<DocumentsInterface[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const itemsPerPage = 10;

  const fetchDocumentsData = useCallback(async () => {
    try {
      setLoading(true);
      if (userDetailsId) {
        const response = await getDocumentsData({
          userDetailsId: userDetailsId,
        });
        if (response) {
          setDocumentsData(response.data);
          setTotalPages(Math.ceil(response.meta.totalPages / itemsPerPage));
        }
        setLoading(false);
      }
    } catch (e) {
      console.log("Error", e);
    } finally {
      setLoading(false);
    }
  }, [userDetailsId]);

  useEffect(() => {
    fetchDocumentsData();
  }, [fetchDocumentsData]);

  const paginatedData = documentsData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  if (loading) {
    return <LoadingButton />;
  }

  return (
    <>
      {paginatedData && (
        <DataTable
          searchKey="Documents"
          columns={columns()}
          data={paginatedData}
          pageNo={page}
          totalPages={totalPages}
          onPageChange={(newPage: number) => setPage(newPage)}
        />
      )}
    </>
  );
}

export default ViewPatientDocuments;
