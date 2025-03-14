import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";
import { useToast } from "@/hooks/use-toast";
import { VitalsInterface } from "@/types/vitalsInterface";
import { getVitalsData } from "@/services/vitalsServices";
import { showToast } from "@/utils/utils";
import VitalDialog from "./VitalDialog";
import { columns } from "./column";
import { useCallback, useEffect, useState } from "react";
import TableShimmer from "@/components/custom_buttons/shimmer/TableShimmer";

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

  return (
    <div className="flex flex-col space-y-4">
      {loading && <TableShimmer />}
      {!loading && (
        <DefaultDataTable
          title={"Vitals"}
          onAddClick={() => {
            setEditData(undefined);
            setIsDialogOpen(true);
          }}
          columns={columns({
            fetchVitalsData,
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
          })}
          data={vitalsData}
          pageNo={page}
          totalPages={total}
          onPageChange={(newPage) => setPage(newPage)}
        />
      )}
      <VitalDialog
        isOpen={isDialogOpen}
        vitalsData={editData}
        userDetailsId={userDetailsId}
        onClose={handleDialogClose}
      />
    </div>
  );
};

export default ViewPatientVitals;
