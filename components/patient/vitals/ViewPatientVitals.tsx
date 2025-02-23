import LoadingButton from "@/components/LoadingButton";
import { useToast } from "@/hooks/use-toast";
import { getVitalsData } from "@/services/vitalsServices";
import { VitalsInterface } from "@/types/vitalsInterface";
import { showToast } from "@/utils/utils";
import { columns } from "./column";
import { useCallback, useEffect, useState } from "react";
import VitalDialog from "./VitalDialog";
import { PlusIcon } from "lucide-react";
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";

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
  const [total, setTotal] = useState<number>(1);
  const [page, setPage] = useState(1);

  // Toast State
  const { toast } = useToast();

  // For Both, Edit and Add Dialog
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    fetchVitalsData();
  };

  // GET Vitals Data
  const fetchVitalsData = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getVitalsData({ userDetailsId, page, limit });

      if (response) {
        setVitalsData(response.data);
        setTotal(Math.ceil(response.total / Number(limit)));
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
    <>
      <div className="flex justify-between">
        <Heading title="Vitals" />
        <Button
          onClick={() => {
            setEditData(undefined);
            setIsDialogOpen(true);
          }}
        >
          Add Vitals
          <PlusIcon />
        </Button>
        <VitalDialog
          isOpen={isDialogOpen}
          vitalsData={editData}
          userDetailsId={userDetailsId}
          onClose={handleDialogClose}
        />
      </div>
      <div className="flex flex-col gap-6">
        <DefaultDataTable
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
          totalPages={total}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </div>
    </>
  );
};

export default ViewPatientVitals;
