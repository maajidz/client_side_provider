"use client";

import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { columns } from "./columns";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import CreateEncounterDialog from "@/components/charts/CreateEncounterDialog";
import { useCallback, useEffect, useState } from "react";
import { getEncounterList } from "@/services/chartsServices";
import { EncounterInterface } from "@/types/encounterInterface";
import LoadingButton from "@/components/LoadingButton";

export const ChartsClient = () => {
  const providerDetails = useSelector((state: RootState) => state.login);
  const [chartList, setChartList] = useState<EncounterInterface>();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const router = useRouter();

  const fetchEncounterList = useCallback(
    async (page: number) => {
      const limit = 5;
      setLoading(true);
      try {
        if (providerDetails) {
          const response = await getEncounterList({
            providerID: providerDetails.providerId,
            limit: 2,
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

  if (loading) {
    return <LoadingButton />;
  }

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title={`Chart Notes`} description="" />
        <CreateEncounterDialog />
      </div>
      <Separator />

      {chartList?.response && (
        <DataTable
          searchKey="name"
          columns={columns(handleRowClick)}
          data={chartList.response}
          pageNo={page}
          totalPages={totalPages}
          onPageChange={(newPage: number) => setPage(newPage)}
        />
      )}
    </>
  );
};
