"use client";

import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";
import { useRouter } from "next/navigation";
import { columns } from "./columns";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import CreateEncounterDialog from "@/components/charts/CreateEncounterDialog";
import { useCallback, useEffect, useState } from "react";
import { getEncounterList } from "@/services/chartsServices";
import { EncounterInterface } from "@/types/encounterInterface";
import TableShimmer from "@/components/custom_buttons/table/TableShimmer";

export const ChartsClient = () => {
  const providerDetails = useSelector((state: RootState) => state.login);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [chartList, setChartList] = useState<EncounterInterface>();
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const router = useRouter();

  const fetchEncounterList = useCallback(
    async (page: number) => {
      const limit = 14;
      setLoading(true);
      try {
        if (providerDetails) {
          const response = await getEncounterList({
            id: providerDetails.providerId,
            idType: "providerID",
            limit: 10,
            page: page,
          });
          if (response) {
            setChartList(response);
            setTotalPages(Math.ceil(response.total / limit));
          }
          setLoading(false);
        }
      } catch (e) {
        console.log("Error", e);
      }
    },
    [providerDetails]
  );

  useEffect(() => {
    fetchEncounterList(page);
  }, [page, fetchEncounterList]);

  const handleRowClick = (id: string) => {
    router.push(`/encounter/${id}`);
  };

  return (
    <>
      <div className="flex items-start justify-between">
        <CreateEncounterDialog
          isDialogOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
          }}
        />
      </div>

      {loading && <TableShimmer />}
      {chartList?.response && (
        <DefaultDataTable
          onAddClick={() => {
            setIsDialogOpen(true);
          }}
          title="Chart Notes"
          columns={columns(handleRowClick)}
          data={chartList.response}
          pageNo={page}
          className="capitalize"
          totalPages={totalPages}
          onPageChange={(newPage: number) => setPage(newPage)}
        />
      )}
    </>
  );
};
