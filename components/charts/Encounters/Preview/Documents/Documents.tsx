import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";
import LoadingButton from "@/components/LoadingButton";
import { getDocumentsData } from "@/services/documentsServices";
import { UserEncounterData } from "@/types/chartsInterface";
import { DocumentsInterface } from "@/types/documentsInterface";
import { columns } from "./columns";
import { useCallback, useEffect, useState } from "react";

function Documents({ patientDetails }: { patientDetails: UserEncounterData }) {
  // Documents Data
  const [documentsData, setDocumentsData] = useState<DocumentsInterface[]>([]);

  // Loading State
  const [loading, setLoading] = useState(false);

  // Pagination State
  const itemsPerPage = 8;
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // GET Documents Data
  const fetchDocumentsData = useCallback(async () => {
    setLoading(true);

    try {
      if (patientDetails.userDetails.userDetailsId) {
        const response = await getDocumentsData({
          userDetailsId: patientDetails.userDetails.userDetailsId,
          page,
          limit: itemsPerPage,
        });

        if (response) {
          setDocumentsData(response.data);

          const totalItems = response.meta.totalCount;
          setTotalPages(Math.ceil(totalItems / itemsPerPage));
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [page, patientDetails.userDetails.userDetailsId]);

  // Effects
  useEffect(() => {
    fetchDocumentsData();
  }, [fetchDocumentsData]);

  if (loading) return <LoadingButton />;

  return (
    <>
        {documentsData && (
          <DefaultDataTable
            columns={columns()}
            data={documentsData}
            pageNo={page}
            totalPages={totalPages}
            onPageChange={(newPage: number) => setPage(newPage)}
          />
        )}
    </>
  );
}

export default Documents;
