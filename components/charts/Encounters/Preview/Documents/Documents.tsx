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
  const itemsPerPage = 10;
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // GET Documents Data
  const fetchDocumentsData = useCallback(async () => {
    setLoading(true);

    try {
      if (patientDetails.userDetails.id) {
        const response = await getDocumentsData({
          userDetailsId: patientDetails.userDetails.id,
          page: page,
          limit: 10
        });

        setDocumentsData(response.data);
        setTotalPages(Math.ceil(response.meta.totalPages / itemsPerPage));
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [page, patientDetails.userDetails.id,]);

  // Effects
  useEffect(() => {
    fetchDocumentsData();
  }, [fetchDocumentsData]);

  const paginatedData = documentsData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  if (loading) return <LoadingButton />;

  return (
    <>
      <div className="py-5">
        {paginatedData && (
          <DefaultDataTable
            columns={columns()}
            data={paginatedData}
            pageNo={page}
            totalPages={totalPages}
            onPageChange={(newPage: number) => setPage(newPage)}
          />
        )}
      </div>
    </>
  );
}

export default Documents;
