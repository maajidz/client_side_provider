import LoadingButton from "@/components/LoadingButton";
import { DataTable } from "@/components/ui/data-table";
import { useToast } from "@/hooks/use-toast";
import { fetchDiagnosesForUser } from "@/services/chartsServices";
import { DiagnosesInterface } from "@/types/chartsInterface";
import { showToast } from "@/utils/utils";
import { columns } from "./column";
import { useCallback, useEffect, useState } from "react";
import EditDiagnosisDialog from "./EditDiagnosesDialog";

interface DiagnosesClientProps {
  userDetailsId: string;
}

function DiagnosesClient({ userDetailsId }: DiagnosesClientProps) {
  // Diagnoses State
  const [diagnosesData, setDiagnoses] = useState<DiagnosesInterface[]>([]);

  // Edit Data State
  const [editData, setEditData] = useState<DiagnosesInterface>();

  // Pagination State
  const itemsPerPage = 5;
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Loading State
  const [loading, setLoading] = useState(false);

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Toast State
  const { toast } = useToast();

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

  if (loading) return <LoadingButton />;

  return (
    <>
      <DataTable
        searchKey="diagnoses"
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
          fetchDiagnoses: () => fetchDiagnoses(page),
        })}
        data={diagnosesData}
        pageNo={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
      />

      {/* Edit Diagnoses Dialog */}
      <EditDiagnosisDialog
        diagnosisData={editData}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
}

export default DiagnosesClient;

// 