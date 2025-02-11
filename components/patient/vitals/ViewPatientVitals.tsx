import LoadingButton from "@/components/LoadingButton";
import { DataTable } from "@/components/ui/data-table";
import { useToast } from "@/hooks/use-toast";
import { getVitalsData } from "@/services/vitalsServices";
import { VitalsInterface } from "@/types/vitalsInterface";
import { showToast } from "@/utils/utils";
import { columns } from "./column";
import { useCallback, useEffect, useState } from "react";
import VitalDialog from "./VitalDialog";
import { PlusIcon } from "lucide-react";
import DefaultButton from "@/components/custom_buttons/buttons/DefaultButton";

const ViewPatientVitals = ({ userDetailsId }: { userDetailsId: string }) => {
  // Vitals State
  const [vitalsData, setVitalsData] = useState<VitalsInterface[]>([]);

  // Edit Data State
  const [editData, setEditData] = useState<VitalsInterface | undefined>(
    undefined
  );

  // Loading State
  const [loading, setLoading] = useState(false);

  // Pagination State
  const limit = 5;
  const [page, setPage] = useState(1);

  // Toast State
  const { toast } = useToast();

  // For Both, Edit and Add Dialog
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  // GET Vitals Data
  const fetchVitalsData = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getVitalsData({ userDetailsId, page, limit });

      if (response) {
        setVitalsData(response.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [userDetailsId, page]);

  // Effects
  useEffect(() => {
    fetchVitalsData();
  }, [fetchVitalsData]);

  if (loading) return <LoadingButton />;

  return (
    <div className="space-y-3">
      <div className="flex justify-end mb-4">
        <DefaultButton
          onClick={() => {
            setEditData(undefined); 
            setIsDialogOpen(true);
          }}
        >
          <PlusIcon />
          Add Vitals
        </DefaultButton>
      </div>
      <DataTable
        searchKey="vitals"
        columns={columns({
          fetchVitalsData,
          setEditData,
          setIsDialogOpen,
          setLoading,
          showToast: () =>
            showToast({
              toast,
              type: "success",
              message: "Deleted Successfully",
            }),
        })}
        data={vitalsData}
        pageNo={page}
        totalPages={1}
        onPageChange={(newPage) => setPage(newPage)}
      />

      {/* Edit and Add Vital Dialog */}
      {isDialogOpen && (
        <VitalDialog
          isOpen={isDialogOpen}
          vitalsData={editData}
          userDetailsId={userDetailsId}
          onHandleDialog={(isOpen) => {
            setIsDialogOpen(isOpen);
            if (!isOpen) setEditData(undefined);
          }}
          onFetchVitalsData={fetchVitalsData}
        />
      )}
    </div>
  );
};

export default ViewPatientVitals;

