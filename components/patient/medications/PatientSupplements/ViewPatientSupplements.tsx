import DefaultButton from "@/components/custom_buttons/buttons/DefaultButton";
import SupplementsDialog from "@/components/charts/Encounters/Details/Supplements/SupplementsDialog";
import LoadingButton from "@/components/LoadingButton";
import { DataTable } from "@/components/ui/data-table";
import { useToast } from "@/hooks/use-toast";
import { getSupplements } from "@/services/chartDetailsServices";
import { RootState } from "@/store/store";
import { SupplementInterface } from "@/types/supplementsInterface";
import { showToast } from "@/utils/utils";
import { columns } from "./columns";
import { PlusIcon } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

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
  const [isDialogOpen, setIsDialogOpen] = useState({
    create: false,
    edit: false,
  });
  const [editData, setEditData] = useState<SupplementInterface | null>(null);
  const { toast } = useToast();

  const fetchSupplementsList = useCallback(async () => {
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
  }, [providerDetails, userDetailsId]);

  useEffect(() => {
    fetchSupplementsList();
  }, [fetchSupplementsList]);

  if (loading) {
    return <LoadingButton />;
  }

  return (
    <>
      <div className="flex justify-end">
        <DefaultButton
          onClick={() => {
            setIsDialogOpen((prev) => ({ ...prev, create: true }));
            fetchSupplementsList();
          }}
        >
          <PlusIcon />
          Supplements
        </DefaultButton>
        <SupplementsDialog
          userDetailsId={userDetailsId}
          onClose={() => {
            setIsDialogOpen((prev) => ({ ...prev, create: false }));
            fetchSupplementsList();
          }}
          isOpen={isDialogOpen.create}
        />
      </div>
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
              fetchSupplementsList: () => fetchSupplementsList(),
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
            setIsDialogOpen((prev) => ({ ...prev, edit: false }));
            fetchSupplementsList();
          }}
          isOpen={isDialogOpen.edit}
          userDetailsId={userDetailsId}
        />
      </div>
    </>
  );
};

export default ViewPatientSupplements;
