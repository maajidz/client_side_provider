import LoadingButton from "@/components/LoadingButton";
import { DataTable } from "@/components/ui/data-table";
import { useToast } from "@/hooks/use-toast";
import { getUserPrescriptionsData } from "@/services/prescriptionsServices";
import { RootState } from "@/store/store";
import { PrescriptionDataInterface } from "@/types/prescriptionInterface";
import { showToast } from "@/utils/utils";
import { columns } from "./column";
import { useEffect, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import EditPrescription from "./EditPrescription";

const ViewPatientMedications = ({
  userDetailsId,
}: {
  userDetailsId: string;
}) => {
  const providerDetails = useSelector((state: RootState) => state.login);
  const [resultList, setResultList] = useState<PrescriptionDataInterface[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const itemsPerPage = 5;
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [editData, setEditData] = useState<PrescriptionDataInterface>();
  const { toast } = useToast();

  const fetchPrescriptionsList = useCallback(
    async (userDetailsId: string) => {
      try {
        if (providerDetails) {
          const response = await getUserPrescriptionsData({
            userDetailsId,
            page,
            limit: itemsPerPage,
          });
          if (response) {
            setResultList(response.data);
            setTotalPages(Math.ceil(response.totalCount / itemsPerPage));
          }
          setLoading(false);
        }
      } catch (e) {
        console.log("Error", e);
      }
    },
    [providerDetails, page]
  );

  useEffect(() => {
    fetchPrescriptionsList(userDetailsId);
  }, [fetchPrescriptionsList, userDetailsId]);

  if (loading) {
    return <LoadingButton />;
  }

  return (
    <>
      <div className="py-5">
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
              fetchPrescriptionsList: () =>
                fetchPrescriptionsList(userDetailsId),
            })}
            data={resultList}
            pageNo={page}
            totalPages={totalPages}
            onPageChange={(newPage: number) => setPage(newPage)}
          />
        )}
        <EditPrescription
          isOpen={isDialogOpen}
          selectedPrescription={editData}
          onSetIsOpen={setIsDialogOpen}
        />
      </div>
    </>
  );
};

export default ViewPatientMedications;
