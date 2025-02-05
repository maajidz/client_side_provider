import SupplementsDialog from "@/components/charts/Encounters/Details/Supplements/SupplementsDialog";
import LoadingButton from "@/components/LoadingButton";
import { DataTable } from "@/components/ui/data-table";
import { useToast } from "@/hooks/use-toast";
import { getSupplements } from "@/services/chartDetailsServices";
import { RootState } from "@/store/store";
import { SupplementInterface } from "@/types/supplementsInterface";
import { showToast } from "@/utils/utils";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { columns } from "./columns";

const ViewPatientSupplements = ({
  userDetailsId,
}: {
  userDetailsId: string;
}) => {
  const providerDetails = useSelector((state: RootState) => state.login);
  const [resultList, setResultList] = useState<SupplementInterface[]>();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [editData, setEditData] = useState<SupplementInterface | null>(null);
  const { toast } = useToast();

  const fetchSupplementsList = useCallback(
    async (userDetailsId: string) => {
      try {
        if (providerDetails) {
          const response = await getSupplements({
            userDetailsId,
          });
          if (response) {
            setResultList(response?.data);
            setTotalPages(Math.ceil(response.total / response.limit));
          }
          setLoading(false);
        }
      } catch (e) {
        console.log("Error", e);
      }
    },
    [providerDetails]
  );

  useEffect(() => {
    fetchSupplementsList(userDetailsId);
  }, [fetchSupplementsList, userDetailsId]);

  if (loading) {
    return <LoadingButton />;
  }

  return (
    <>
      <div className="space-y-3 py-5">
        {resultList && (
          <DataTable
            searchKey="id"
            columns={columns({
              setEditData,
              setIsDialogOpen,
              setLoading,
              showToast: () =>
                showToast({
                  toast,
                  type: "success",
                  message: "Deleted Successfully",
                }),
              fetchSupplementsList: () => fetchSupplementsList(userDetailsId),
            })}
            data={resultList}
            pageNo={page}
            totalPages={totalPages}
            onPageChange={(newPage: number) => setPage(newPage)}
          />
        )}

        <SupplementsDialog
          selectedSupplement={editData}
          onClose={() => {
            setIsDialogOpen(false);
            fetchSupplementsList(userDetailsId);
          }}
          isOpen={isDialogOpen}
          userDetailsId={userDetailsId}
        />
      </div>
    </>
  );
};

export default ViewPatientSupplements;
