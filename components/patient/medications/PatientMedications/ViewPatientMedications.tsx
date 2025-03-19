import { useToast } from "@/hooks/use-toast";
import { getUserPrescriptionsData } from "@/services/prescriptionsServices";
import { RootState } from "@/store/store";
import { PrescriptionDataInterface } from "@/types/prescriptionInterface";
import { showToast } from "@/utils/utils";
import { columns } from "./column";
import { useEffect, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import EditPrescription from "./EditPrescription";
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";
import AddMedicationDialog from "@/components/charts/Encounters/Details/Medications/AddMedicationDialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { getMedicationData } from "@/services/chartDetailsServices";
import { MedicationResultInterface } from "@/types/medicationInterface";
import { MedicationColumn } from "./medicationColumn";
import TableShimmer from "@/components/custom_buttons/shimmer/TableShimmer";

const ViewPatientMedications = ({
  userDetailsId,
  onSetQuickRxVisible,
}: {
  userDetailsId: string;
  onSetQuickRxVisible: (visible: boolean) => void;
}) => {
  const providerDetails = useSelector((state: RootState) => state.login);
  const [resultList, setResultList] = useState<PrescriptionDataInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [medicationLoading, setMedicationLoading] = useState<boolean>(false);

  // Medications State
  const [medications, setMedicationsData] = useState<
    MedicationResultInterface[]
  >([]);

  // Pagination State
  const itemsPerPage = 6;
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isMedicationsDialogOpen, setIsMedicationsDialogOpen] = useState(false);
  const [editData, setEditData] = useState<PrescriptionDataInterface>();
  const { toast } = useToast();

  // Get Medication Data
  const fetchMedicationData = useCallback(async () => {
    setMedicationLoading(true);

    try {
      const response = await getMedicationData({
        page,
        limit: itemsPerPage,
      });
      setMedicationsData(response.result);

      setTotalPages(Math.ceil(response.total / itemsPerPage));
    } catch (err) {
      console.error("Error fetching pharmacy data:", err);
    } finally {
      setMedicationLoading(false);
    }
  }, [page, itemsPerPage]);

  const fetchPrescriptionsList = useCallback(
    async (userDetailsId: string) => {
      try {
        if (providerDetails) {
          const response = await getUserPrescriptionsData({
            userDetailsId,
            page,
            limit: itemsPerPage
          });
          if (response) {
            const filteredData = response.data.filter(
              (prescription: PrescriptionDataInterface | null) =>
                prescription !== null
            );
            setResultList(filteredData);
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
    fetchMedicationData();
  }, [fetchPrescriptionsList, fetchMedicationData, userDetailsId]);

  return (
    <>
      <div className="flex flex-col gap-4">
        {loading ? (
          <TableShimmer />
        ) : (
          <DefaultDataTable
            className="flex flex-col gap-4"
            title={
              <div className="flex flex-row gap-5 items-center">
                <div>Medications</div>
                <Button
                  onClick={() => {
                    onSetQuickRxVisible(true);
                  }}
                >
                  <PlusIcon />
                  Prescriptions
                </Button>
              </div>
            }
            onAddClick={() => setIsMedicationsDialogOpen(true)}
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
              // showToast: (args) => showToast({ toast, ...args }),
              fetchPrescriptionsList: () =>
                fetchPrescriptionsList(userDetailsId),
            })}
            data={resultList || []}
            pageNo={page}
            totalPages={totalPages}
            onPageChange={(newPage: number) => setPage(newPage)}
          />
        )}

        {/* Medication DatTable */}
        {medicationLoading ? (
          <TableShimmer />
        ) : (
          <DefaultDataTable
            columns={MedicationColumn()}
            data={medications || []}
            pageNo={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        )}

        <EditPrescription
          userDetailsId={userDetailsId}
          isOpen={isDialogOpen}
          selectedPrescription={editData}
          onFetchPrescriptionsList={fetchPrescriptionsList}
          onSetIsOpen={setIsDialogOpen}
        />
        <AddMedicationDialog
          userDetailsId={userDetailsId}
          onClose={() => {
            setIsMedicationsDialogOpen(false);
          }}
          isOpen={isMedicationsDialogOpen}
        />
      </div>
    </>
  );
};

export default ViewPatientMedications;
