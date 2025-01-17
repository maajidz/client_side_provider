import { getEncounterList } from "@/services/chartsServices";
import { RootState } from "@/store/store";
import { EncounterInterface } from "@/types/encounterInterface";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LoadingButton from "@/components/LoadingButton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import AllEncountersTab from "./AllEncountersTab";
import ChartNotes from "@/components/charts/Encounters/Preview/ChartNotes";

const ViewPatientEncounters = ({
  userDetailsId,
}: {
  userDetailsId: string;
}) => {
  const providerDetails = useSelector((state: RootState) => state.login);
  const [chartList, setChartList] = useState<EncounterInterface>();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchEncounterList = useCallback(
    async (page: number) => {
      const limit = 14;
      setLoading(true);
      try {
        if (providerDetails) {
          const response = await getEncounterList({
            id: providerDetails.providerId,
            idType: "providerID",
            limit: 2,
            page: page,
            userDetailsId: userDetailsId,
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
    [providerDetails, userDetailsId]
  );

  useEffect(() => {
    fetchEncounterList(page);
  }, [page, fetchEncounterList]);

  if (loading) {
    return <LoadingButton />;
  }

  return (
    <>
      <Tabs defaultValue="lastvisit" className="flex gap-5">
        <TabsList className="flex flex-col gap-2 h-full">
          <TabsTrigger value="lastvisit">Last visit</TabsTrigger>
          <TabsTrigger value="unsigned">Unsigned</TabsTrigger>
          <TabsTrigger value="cosigned">To Be Cosigned</TabsTrigger>
          <TabsTrigger value="6months">Past 6 Months</TabsTrigger>
          <TabsTrigger value="1year">Past 1 year</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
          <Separator className="bg-black w-full text-black border border-black" />
          <TabsTrigger value="phoneCalls">Phone calls</TabsTrigger>
          <TabsTrigger value="pastReports">Past Reports</TabsTrigger>
     
        </TabsList>
        <TabsContent value="lastvisit">
          {chartList && chartList.response && chartList.response[0].chart && (
            <ChartNotes patientChart={chartList.response[0].chart} />
          )}
        </TabsContent>
        <TabsContent value="unsigned">Unsigned</TabsContent>
        <TabsContent value="cosigned">To Be Cosigned</TabsContent>
        <TabsContent value="6months">Past 6 Months</TabsContent>
        <TabsContent value="1year">Past 1 year</TabsContent>
        <TabsContent value="all">
          {chartList && (
            <AllEncountersTab
              chartList={chartList}
              page={page}
              totalPages={totalPages}
              setPage={setPage}
            />
          )}
        </TabsContent>
        <TabsContent value="phoneCalls">Phone calls</TabsContent>
        <TabsContent value="pastReports">Past Reports</TabsContent>
      </Tabs>
    </>
  );
};

export default ViewPatientEncounters;
