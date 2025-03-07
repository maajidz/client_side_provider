import LoadingButton from "@/components/LoadingButton";
import { useToast } from "@/hooks/use-toast";
import { fetchDiagnosesForUser } from "@/services/chartsServices";
import { DiagnosesInterface } from "@/types/chartsInterface";
import { showToast } from "@/utils/utils";
import { columns } from "./column";
import { useCallback, useEffect, useState } from "react";
import EditDiagnosisDialog from "./EditDiagnosesDialog";
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";
import AddDiagnosesDialog from "./AddDiagnosesDialog";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface DiagnosesClientProps {
  userDetailsId: string;
}

function DiagnosesClient({ userDetailsId }: DiagnosesClientProps) {
  // Diagnoses State
  const [diagnosesData, setDiagnoses] = useState<DiagnosesInterface[]>([]);

  // Edit Data State
  const [editData, setEditData] = useState<DiagnosesInterface | null>(null);

  // Pagination State
  const itemsPerPage = 5;
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Loading State
  const [loading, setLoading] = useState(false);

  // Dialog State
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  // Toast State
  const { toast } = useToast();

  const chartId = useSelector((state: RootState) => state.user.chartId);

  // GET Diagnoses for a patient
  const fetchDiagnoses = useCallback(
    async (page: number) => {
      setLoading(true);

      try {
        const response = await fetchDiagnosesForUser({
          userDetailsId,
          page,
          limit: itemsPerPage,
        });

        if (response) {
          setDiagnoses(response.diagnoses);
          setTotalPages(Math.ceil(response.totalCount / itemsPerPage));
        }
      } catch (err) {
        console.log("Error", err);
      } finally {
        setLoading(false);
      }
    },
    [userDetailsId]
  );

  // Effects
  useEffect(() => {
    fetchDiagnoses(page);
  }, [fetchDiagnoses, page]);

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
    setEditData(null);
    fetchDiagnoses(page);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    fetchDiagnoses(page);
  };

  if (loading) return <LoadingButton />;

  return (
    <div className="flex flex-col gap-4">
      <DefaultDataTable
        title={"Diagnoses"}
        onAddClick={() => {
          setIsDialogOpen(true);
        }}
        columns={columns({
          setEditData,
          setIsDialogOpen: setIsEditDialogOpen,
          setLoading,
          showToast: (args) => showToast({ toast, ...args }),
          fetchDiagnoses: () => fetchDiagnoses(page),
        })}
        data={diagnosesData}
        pageNo={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
      />
      <AddDiagnosesDialog
        isOpen={isDialogOpen}
        userDetailsId={userDetailsId}
        chartId={chartId}
        onClose={handleDialogClose}
      />
      <EditDiagnosisDialog
        diagnosisData={editData}
        isOpen={isEditDialogOpen}
        onFetchDiagnosesData={fetchDiagnoses}
        onClose={handleEditDialogClose}
      />
    </div>
  );
}

export default DiagnosesClient;
