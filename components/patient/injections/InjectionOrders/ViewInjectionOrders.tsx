import { columns } from "@/components/injections/injection-orders/column";
import LoadingButton from "@/components/LoadingButton";
import { DataTable } from "@/components/ui/data-table";
import { useToast } from "@/hooks/use-toast";
import { getInjectionsData } from "@/services/injectionsServices";
import { RootState } from "@/store/store";
import { InjectionsInterface } from "@/types/injectionsInterface";
import { showToast } from "@/utils/utils";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ViewInjectionOrders = ({ userDetailsId }: { userDetailsId: string }) => {
  const providerDetails = useSelector((state: RootState) => state.login);
  const [resultList, setResultList] = useState<InjectionsInterface[]>([]);
  const limit = 8;
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchInjectionsData = useCallback(
    async (page: number, userDetailsId: string, status?: string) => {
      try {
        setLoading(true);
        if (providerDetails) {
          const response = await getInjectionsData({
            providerId: providerDetails.providerId,
            limit: limit,
            page: page,
            status,
            userDetailsId,
          });
          if (response) {
            setResultList(response.data);
            setTotalPages(Math.ceil(response.total / Number(response.limit)));
          }
          setLoading(false);
        }
      } catch (e) {
        console.log("Error", e);
      } finally {
        setLoading(false);
      }
    },
    [providerDetails]
  );

  useEffect(() => {
    fetchInjectionsData(page, userDetailsId);
  }, [page, fetchInjectionsData, userDetailsId]);

  if (loading) {
    return <LoadingButton />;
  }

  return (
    <>
      {resultList && (
        <DataTable
          searchKey="Injections"
          columns={columns({
            setLoading,
            showToast: () =>
              showToast({
                toast,
                type: "success",
                message: "Deleted Successfully",
              }),
              fetchInjectionList: () => fetchInjectionsData(page, userDetailsId),
          })}
          data={resultList}
          pageNo={page}
          totalPages={totalPages}
          onPageChange={(newPage: number) => setPage(newPage)}
        />
      )}
    </>
  );
};

export default ViewInjectionOrders;
