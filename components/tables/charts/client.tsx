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
import TableShimmer from "@/components/custom_buttons/shimmer/TableShimmer";

export const ChartsClient = () => {
  // Provider Details
  const providerDetails = useSelector((state: RootState) => state.login);

  // Encounter Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  // Chart List Data State
  const [chartList, setChartList] = useState<EncounterInterface>();

  // Loading State
  const [loading, setLoading] = useState<boolean>(false);

  // Pagination States
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const router = useRouter();

  // Fetch Encounter List
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

  //Effects
  useEffect(() => {
    fetchEncounterList(page);
  }, [page, fetchEncounterList]);

  // Navigation handler
  const handleRowClick = (id: string) => {
    router.push(`/encounter/${id}`);
  };

  return (
    <>
      <div className="flex items-start justify-between">
        {/* Create Encounter Dialog */}
        <CreateEncounterDialog
          isDialogOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            fetchEncounterList(page);
          }}
        />
      </div>

      {/* Chart List Table */}
      {loading ? (
        <TableShimmer />
      ) : (
        <DefaultDataTable
          onAddClick={() => {
            setIsDialogOpen(true);
          }}
          title="Chart Notes"
          columns={columns(handleRowClick)}
          data={chartList?.response || []}
          pageNo={page}
          totalPages={totalPages}
          onPageChange={(newPage: number) => setPage(newPage)}
        />
      )}
    </>
  );
};
