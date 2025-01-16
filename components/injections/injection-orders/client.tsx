import LoadingButton from "@/components/LoadingButton";
import { DataTable } from "@/components/ui/data-table";
import { getInjectionsData } from "@/services/injectionsServices";
import { InjectionsInterface } from "@/types/injectionsInterface";
import { columns } from "./column";
import FilterInjections from "./FilterInjections";
import { useCallback, useEffect, useState } from "react";

function InjectionsClient() {
  // Data State
  const [injectionsData, setInjectionsData] = useState<InjectionsInterface[]>(
    []
  );

  // Pagination State
  const itemsPerPage = 10;
  const [pageNo, setPageNo] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Loading State
  const [loading, setLoading] = useState(false);

  // GET Injections Data
  const fetchInjectionsData = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getInjectionsData({
        page: pageNo,
        limit: itemsPerPage,
      });

      if (response) {
        setInjectionsData(response.data);
        setTotalPages(Math.ceil(response.total / itemsPerPage));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [pageNo]);

  // Effects
  useEffect(() => {
    fetchInjectionsData();
  }, [fetchInjectionsData]);

  if (loading) return <LoadingButton />;

  return (
    <div className="space-y-2">
      <div className="space-y-2">
        <FilterInjections />
      </div>
      <DataTable
        searchKey="Injections"
        columns={columns()}
        data={injectionsData}
        pageNo={pageNo}
        totalPages={totalPages}
        onPageChange={(newPage) => setPageNo(newPage)}
      />
    </div>
  );
}

export default InjectionsClient;
