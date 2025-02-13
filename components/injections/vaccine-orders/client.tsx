import LoadingButton from "@/components/LoadingButton";
import { getVaccinesData } from "@/services/injectionsServices";
import { VaccinesInterface } from "@/types/injectionsInterface";
import { columns } from "./column";
import FilterVaccines from "./FilterVaccines";
import { useCallback, useEffect, useState } from "react";
import { vaccineSearchParams } from "@/schema/injectionsAndVaccinesSchema";
import { z } from "zod";
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";
import { showToast } from "@/utils/utils";
import { useToast } from "@/hooks/use-toast";

function VaccinesClient({ refreshTrigger }: { refreshTrigger: number }) {
  // Data State
  const [vaccinesData, setVaccinesData] = useState<VaccinesInterface[]>([]);

  // Pagination State
  const itemsPerPage = 10;
  const [pageNo, setPageNo] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const { toast } = useToast();

  // Filters State
  const [filters, setFilters] = useState({
    providerId: "",
    userDetailsId: "",
    status: "",
  });

  // Loading State
  const [loading, setLoading] = useState(false);

  // GET Injections Data
  const fetchInjectionsData = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getVaccinesData({
        userDetailsId: filters.userDetailsId,
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
  }, [pageNo, filters.userDetailsId, filters.providerId, filters.status]);

  const handleSearch = (filterValues: z.infer<typeof vaccineSearchParams>) => {
    if (filterValues.userDetailsId === "all") {
      filterValues.status = "";
    }

    if (filterValues.providerId === "all") {
      filterValues.providerId = "";
    }

    setFilters({
      providerId: filterValues.providerId || "",
      userDetailsId: filterValues.userDetailsId || "",
      status: filterValues.status || "",
    });
    setPageNo(1);
  };

  // Effects
  useEffect(() => {
    fetchInjectionsData();
  }, [fetchInjectionsData, refreshTrigger]);

  if (loading) return <LoadingButton />;

  return (
    <div className="space-y-2">
      <div className="space-y-2">
        <FilterVaccines
          vaccinesData={vaccinesData}
          onHandleSearch={handleSearch}
        />
      </div>
      <DefaultDataTable
        columns={columns({
          setLoading,
          showToast: () =>
            showToast({
              toast,
              type: "success",
              message: "Deleted Successfully",
            }),
            fetchInjectionsData: () => fetchInjectionsData(),
        })}
        data={vaccinesData}
        pageNo={pageNo}
        totalPages={totalPages}
        onPageChange={(newPage) => setPageNo(newPage)}
      />
    </div>
  );
}

export default VaccinesClient;
