import LoadingButton from "@/components/LoadingButton";
import { DataTable } from "@/components/ui/data-table";
import { getHistoricalVaccine } from "@/services/chartDetailsServices";
import { HistoricalVaccineInterface } from "@/types/chartsInterface";
import { columns } from "./column";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import VaccinesDialog from "@/components/charts/Encounters/Details/Vaccines/VaccinesDialog";
import { PlusIcon } from "lucide-react";

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

  // Pagination Data
  const limit = 10;
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Dialog State
  const [isVaccinesDialogOpen, setIsVaccinesDialogOpen] = useState(false);

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

  // If loading, show a loading button
  if (loading) {
    return <LoadingButton />;
  }

  return (
    <div className="py-5">
      <div className="flex justify-end">
        <Button
          className="bg-[#84012A]"
          onClick={() => {
            setIsVaccinesDialogOpen(true);
          }}
        >
          <div className="flex gap-2">
            <PlusIcon />
            Vaccines
          </div>
        </Button>
        <VaccinesDialog
          userDetailsId={userDetailsId}
          isOpen={isVaccinesDialogOpen}
          onClose={() => {
            setIsVaccinesDialogOpen(false);
          }}
          onFetchHistoricalData={fetchHistoricalVaccine}
        />
      </div>
      <DataTable
        searchKey="id"
        columns={columns()}
        data={historicalVaccineData}
        pageNo={page}
        totalPages={totalPages}
        onPageChange={(newPage: number) => setPage(newPage)}
      />
    </div>
  );
};

export default HistoricalVaccinesClient;
