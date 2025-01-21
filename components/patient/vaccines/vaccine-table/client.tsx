import LoadingButton from "@/components/LoadingButton";
import { DataTable } from "@/components/ui/data-table";
import { getHistoricalVaccine } from "@/services/chartDetailsServices";
import { HistoricalVaccineInterface } from "@/types/chartsInterface";
import { columns } from "./column";
import { useCallback, useEffect, useState } from "react";

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

  // GET Historical Vaccine Data
  const fetchHistoricalVaccine = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getHistoricalVaccine(userDetailsId);

      if (response) {
        setHistoricalVaccineData(response.data);
      }
    } catch (err) {
      if (err instanceof Error) {
        console.log("Could not fetch vaccines data");
      }
    } finally {
      setLoading(false);
    }
  }, [userDetailsId]);

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
      <DataTable
        searchKey="id"
        columns={columns()}
        data={historicalVaccineData}
        pageNo={1}
        totalPages={1}
        onPageChange={(newPage: number) => newPage}
      />
    </div>
  );
};

export default HistoricalVaccinesClient;

