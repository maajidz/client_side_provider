import { getHistoricalVaccine } from "@/services/chartDetailsServices";
import { HistoricalVaccineInterface } from "@/types/chartsInterface";
import { columns } from "./column";
import { useCallback, useEffect, useState } from "react";
import VaccinesDialog from "@/components/charts/Encounters/Details/Vaccines/VaccinesDialog";
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";
import { useToast } from "@/hooks/use-toast";
import { showToast } from "@/utils/utils";
import TableShimmer from "@/components/custom_buttons/shimmer/TableShimmer";

interface HistoricalVaccinesProps {
  userDetailsId: string;
}

const HistoricalVaccinesClient = ({
  userDetailsId,
}: HistoricalVaccinesProps) => {
  // Historical Vaccine State
  const [historicalVaccineData, setHistoricalVaccineData] = useState<
    HistoricalVaccineInterface[]
  >([]);

  // Loading State
  const [loading, setLoading] = useState(false);
  // const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  // Pagination Data
  const limit = 10;
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Dialog State
  const [isVaccinesDialogOpen, setIsVaccinesDialogOpen] = useState(false);
  const [editData, setEditData] = useState<HistoricalVaccineInterface | null>(
    null
  );
  const { toast } = useToast();

  // GET Historical Vaccine Data
  const fetchHistoricalVaccine = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getHistoricalVaccine({
        userDetailsId,
        limit,
        page,
      });

      if (response) {
        setHistoricalVaccineData(response.data);
        setTotalPages(Math.ceil(response.total / limit));
      }
    } catch (err) {
      if (err instanceof Error) {
        console.log("Could not fetch vaccines data");
      }
    } finally {
      setLoading(false);
    }
  }, [userDetailsId, limit, page]);

  // Effects
  useEffect(() => {
    fetchHistoricalVaccine();
  }, [fetchHistoricalVaccine]);

  return (
    <div className="flex flex-col gap-6">
      {loading ? (
        <TableShimmer />
      ) : (
        <DefaultDataTable
          title={"Vaccines"}
          onAddClick={() => {
            setIsVaccinesDialogOpen(true);
          }}
          columns={columns({
            setEditData,
            setIsVaccinesDialogOpen,
            setLoading,
            showToast: () =>
              showToast({
                toast,
                type: "success",
                message: "Deleted Successfully",
              }),
            fetchHistoricalVaccine: () => fetchHistoricalVaccine(),
          })}
          data={historicalVaccineData}
          pageNo={page}
          totalPages={totalPages}
          onPageChange={(newPage: number) => setPage(newPage)}
        />
      )}
      <VaccinesDialog
        userDetailsId={userDetailsId}
        vaccinesData={editData}
        isOpen={isVaccinesDialogOpen}
        onClose={() => {
          setIsVaccinesDialogOpen(false);
          setEditData(null);
          fetchHistoricalVaccine();
        }}
        onFetchHistoricalData={fetchHistoricalVaccine}
      />
    </div>
  );
};

export default HistoricalVaccinesClient;
