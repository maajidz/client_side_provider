import { DataTable } from "@/components/ui/data-table";
import { getTransferData } from "@/services/chartsServices";
import { RootState } from "@/store/store";
import { TransferResponseData } from "@/types/chartsInterface";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { columns } from "./columns";
import LoadingButton from "@/components/LoadingButton";

const ViewReferralIn = () => {
  const providerDetails = useSelector((state: RootState) => state.login);
  const [resultList, setResultList] = useState<TransferResponseData[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchReferralsList = useCallback(async () => {
    try {
      if (providerDetails) {
        const response = await getTransferData({
          id: providerDetails.providerId,
          idType: "Referring to ProviderID",
        });
        if (response) {
          setResultList(response);
          setTotalPages(response.length / 10);
        }
        setLoading(false);
      }
    } catch (e) {
      console.log("Error", e);
    }
  }, [providerDetails]);

  useEffect(() => {
    fetchReferralsList();
  }, [fetchReferralsList]);

  if (loading) {
    return <LoadingButton />;
  }

  return (
    <>
      <div className="py-5">
        {resultList && (
          <DataTable
            searchKey="id"
            columns={columns()}
            data={resultList}
            pageNo={page}
            totalPages={totalPages}
            onPageChange={(newPage: number) => setPage(newPage)}
          />
        )}
      </div>
    </>
  );
};

export default ViewReferralIn;
