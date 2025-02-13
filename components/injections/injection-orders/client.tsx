import LoadingButton from "@/components/LoadingButton";
import { getInjectionsData } from "@/services/injectionsServices";
import { InjectionsInterface } from "@/types/injectionsInterface";
import { columns } from "./column";
import FilterInjections from "./FilterInjections";
import { useCallback, useEffect, useState } from "react";
import { injectionsSearchParams } from "@/schema/injectionsAndVaccinesSchema";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { showToast } from "@/utils/utils";
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";

function InjectionsClient({ refreshTrigger }: { refreshTrigger: number }) {
  const [injectionsData, setInjectionsData] = useState<InjectionsInterface[]>(
    []
  );
  const [pageNo, setPageNo] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    providerId: "",
    userDetailsId: "",
    status: "",
  });

  // GET Injections Data
  const fetchInjectionsData = useCallback(
    async (
      page: number,
      status?: string,
      providerId?: string,
      userDetailsId?: string
    ) => {
      setLoading(true);

      try {
        const response = await getInjectionsData({
          providerId: providerId || filters.providerId,
          userDetailsId: userDetailsId || filters.userDetailsId,
          status: status || filters.status,
          page: page,
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
    },
    [
      filters.userDetailsId,
      filters.providerId,
      filters.status
    ]
  );

  const handleSearch = (
    filterValues: z.infer<typeof injectionsSearchParams>
  ) => {
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
    fetchInjectionsData(pageNo, filters.status, filters.providerId, filters.userDetailsId);
  }, [filters, fetchInjectionsData, refreshTrigger, pageNo]);

  if (loading) return <LoadingButton />;

  return (
    <div className="space-y-2">
      <div className="space-y-2">
        <FilterInjections
          injectionsData={injectionsData}
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
          fetchInjectionList: () => fetchInjectionsData(pageNo),
        })}
        data={injectionsData}
        pageNo={pageNo}
        totalPages={totalPages}
        onPageChange={(newPage) => setPageNo(newPage)}
      />
    </div>
  );
}

export default InjectionsClient;
