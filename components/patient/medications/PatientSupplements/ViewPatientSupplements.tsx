import SupplementsDialog from "@/components/charts/Encounters/Details/Supplements/SupplementsDialog";
import { useToast } from "@/hooks/use-toast";
import { getSupplements } from "@/services/chartDetailsServices";
import { RootState } from "@/store/store";
import { SupplementInterfaceResponse } from "@/types/supplementsInterface";
import { showToast } from "@/utils/utils";
import { columns } from "./columns";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";
import TableShimmer from "@/components/custom_buttons/shimmer/TableShimmer";

const ViewPatientSupplements = ({
  userDetailsId,
}: {
  userDetailsId: string;
}) => {
  const providerDetails = useSelector((state: RootState) => state.login);
  const [resultList, setResultList] = useState<SupplementInterfaceResponse[]>();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isDialogOpen, setIsDialogOpen] = useState({
    create: false,
    edit: false,
  });
  const [editData, setEditData] = useState<SupplementInterfaceResponse | null>(
    null
  );
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

  return (
    <>
      <SupplementsDialog
        userDetailsId={userDetailsId}
        onClose={() => {
          setIsDialogOpen((prev) => ({ ...prev, create: false }));
          fetchSupplementsList();
        }}
        isOpen={isDialogOpen.create}
      />
      <div className="">
        {loading ? (
          <TableShimmer />
        ) : (
          resultList && (
            <DefaultDataTable
              title={"Supplements"}
              onAddClick={() => {
                setIsDialogOpen((prev) => ({ ...prev, create: true }));
                fetchSupplementsList();
              }}
              columns={columns({
                setEditData,
                setIsDialogOpen,
                setLoading,
                showToast: ({ type, message }) => {
                  showToast({
                    toast,
                    type: type === "success" ? "success" : "error",
                    message,
                  });
                },
                fetchSupplementsList: () => fetchSupplementsList(),
                userDetailsId
              })}
              data={resultList}
              pageNo={page}
              totalPages={totalPages}
              onPageChange={(newPage: number) => setPage(newPage)}
            />
          )
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
