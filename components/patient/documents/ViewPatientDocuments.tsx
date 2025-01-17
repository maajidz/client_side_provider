import { DataTable } from "@/components/ui/data-table";
import { RootState } from "@/store/store";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LoadingButton from "@/components/LoadingButton";
import { getImageResults } from "@/services/imageResultServices";
import { ImageResultResponseInterface } from "@/types/imageResults";
import { columns } from "@/components/charts/Encounters/Preview/Documents/columns";

function ViewPatientDocuments({ userDetailsId }: { userDetailsId: string }) {
  const providerDetails = useSelector((state: RootState) => state.login);
  const [resultList, setResultList] = useState<ImageResultResponseInterface>();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchImageResultsList = useCallback(async (page: number) => {
    try {
        setLoading(true)
        const limit = 5;
      if (providerDetails) {
        const response = await getImageResults({
          providerId: providerDetails.providerId,
          userDetailsId: userDetailsId,
          limit: limit,
          page: page,
        });
        if (response) {
          setResultList(response);
          setTotalPages(Math.ceil(response.total / limit));
        }
        setLoading(false);
      }
    } catch (e) {
      console.log("Error", e);
    } finally {
        setLoading(false)
    }
  }, [providerDetails, userDetailsId]);

  useEffect(() => {
    fetchImageResultsList(page);
  }, [page, fetchImageResultsList]);

  if(loading){
    return <LoadingButton />
  }

  return (
    <>
        <div className="w-full">
          {resultList?.data && (
            <DataTable
              searchKey="id"
              columns={columns()}
              data={resultList?.data}
              pageNo={page}
              totalPages={totalPages}
              onPageChange={(newPage: number) => setPage(newPage)}
            />
          )}
        </div>
    </>
  );
}

export default ViewPatientDocuments;
