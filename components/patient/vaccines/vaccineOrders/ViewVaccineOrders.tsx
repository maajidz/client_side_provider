import LoadingButton from "@/components/LoadingButton";
import { getVaccinesData } from "@/services/injectionsServices";
import { VaccinesInterface } from "@/types/injectionsInterface";
import { useCallback, useEffect, useState } from "react";
import { vaccineSearchParams } from "@/schema/injectionsAndVaccinesSchema";
import { z } from "zod";
import FilterVaccineOrders from "./FilterVaccineOrders";
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";
import { columns } from "./VaccineColumn";
import { useToast } from "@/hooks/use-toast";
import { showToast } from "@/utils/utils";

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
  const { toast } = useToast();

  // GET Injections Data
  const fetchVaccineOrderData = useCallback(async () => {
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
    fetchVaccineOrderData();
  }, [fetchVaccineOrderData]);

  if (loading) return <LoadingButton />;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-1 flex-row gap-3 items-center w-full">
        <FilterVaccineOrders
          vaccinesData={vaccinesData}
          onHandleSearch={handleSearch}
        />
      </div>
      <DefaultDataTable
        columns={columns({
           setLoading,
           showToast: () => showToast({
            toast,
            type: "success",
            message: "Deleted Successfully",
          }),
           fetchVaccineOrderData: () => fetchVaccineOrderData(),
        })}
        data={vaccinesData}
        pageNo={pageNo}
        totalPages={totalPages}
        onPageChange={(newPage) => setPageNo(newPage)}
      />
    </div>
  );
}

export default ViewVaccineOrders;
