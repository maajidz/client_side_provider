import LoadingButton from "@/components/LoadingButton";
import { DataTable } from "@/components/ui/data-table";
import { getVaccinesData } from "@/services/injectionsServices";
import { VaccinesInterface } from "@/types/injectionsInterface";
import { columns } from "@/components/injections/vaccine-orders/column";
import { useCallback, useEffect, useState } from "react";
import { vaccineSearchParams } from "@/schema/injectionsAndVaccinesSchema";
import { z } from "zod";
import FilterVaccineOrders from "./FilterVaccineOrders";

function ViewVaccineOrders({ userDetailsId }: { userDetailsId: string }) {
  // Data State
  const [vaccinesData, setVaccinesData] = useState<VaccinesInterface[]>([]);

  // Pagination State
  const itemsPerPage = 10;
  const [pageNo, setPageNo] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters State
  const [filters, setFilters] = useState({
    providerId: "",
    status: "",
  });

  // Loading State
  const [loading, setLoading] = useState(false);

  // GET Injections Data
  const fetchInjectionsData = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getVaccinesData({
        userDetailsId: userDetailsId,
        providerId: filters.providerId,
        status: filters.status,
        page: pageNo,
        limit: itemsPerPage,
      });

      if (response) {
        setVaccinesData(response.data);
        setTotalPages(Math.ceil(response.total / itemsPerPage));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [pageNo, userDetailsId, filters.providerId, filters.status]);

  const handleSearch = (filterValues: z.infer<typeof vaccineSearchParams>) => {

    if (filterValues.providerId === "all") {
      filterValues.providerId = "";
    }

    setFilters({
      providerId: filterValues.providerId || "",
      status: filterValues.status || "",
    });
    setPageNo(1);
  };

  // Effects
  useEffect(() => {
    fetchInjectionsData();
  }, [fetchInjectionsData]);

  if (loading) return <LoadingButton />;

  return (
    <div className="space-y-2">
      <div className="space-y-2">
        <FilterVaccineOrders
          vaccinesData={vaccinesData}
          onHandleSearch={handleSearch}
        />
      </div>
      <DataTable
        searchKey="Injections"
        columns={columns()}
        data={vaccinesData}
        pageNo={pageNo}
        totalPages={totalPages}
        onPageChange={(newPage) => setPageNo(newPage)}
      />
    </div>
  );
}

export default ViewVaccineOrders;
