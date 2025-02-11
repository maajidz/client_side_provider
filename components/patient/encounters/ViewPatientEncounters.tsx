import { getEncounterList } from "@/services/chartsServices";
import { RootState } from "@/store/store";
import { EncounterInterface } from "@/types/encounterInterface";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LoadingButton from "@/components/LoadingButton";
import { Tabs, TabsList, TabsContent } from "@/components/ui/tabs";
import AllEncountersTab from "./AllEncountersTab";
import ChartNotes from "@/components/charts/Encounters/Preview/ChartNotes";
import CustomTabsTrigger from "@/components/custom_buttons/buttons/CustomTabsTrigger";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

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

  const patientEncountersTab = [
    {
      value: "lastvisit",
      label: "Last visit",
      component: AllEncountersTab,
    },
    // {
    //   value: "unsigned",
    //   label: "Unsigned",
    //   component: AllEncountersTab,
    // },
    // {
    //   value: "cosigned",
    //   label: "To Be Cosigned",
    //   component: AllEncountersTab,
    // },
    // {
    //   value: "6months",
    //   label: "Past 6 Months",
    //   component: AllEncountersTab,
    // },
    // { value: "1year", label: "Past 1 year", component: AllEncountersTab },
    {
      value: "all",
      label: "All",
      component: AllEncountersTab,
    },
    // {
    //   value: "phoneCalls",
    //   label: "Phone calls",
    //   component: AllEncountersTab,
    // },
    // {
    //   value: "pastReports",
    //   label: "Past Reports",
    //   component: AllEncountersTab,
    // },
  ];

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
    <Tabs defaultValue="lastvisit" className="flex flex-row gap-5">
      <TabsList className="flex flex-col h-full w-56 justify-start items-start p-3 gap-3 overflow-hidden">
        {patientEncountersTab.map((tab) => (
          <CustomTabsTrigger value={tab.value} key={tab.value}>
            {tab.label}
          </CustomTabsTrigger>
        ))}
      </TabsList>
      {patientEncountersTab.map(({ value, component: Component }) => (
        <TabsContent value={value} key={value} className="w-full">
          <ScrollArea className={cn("h-[calc(60dvh-52px)]")}>
            {value === "lastvisit"
              ? chartList &&
                chartList.response &&
                chartList.response[0].chart && (
                  <ChartNotes patientChart={chartList.response[0].chart} />
                )
              : chartList && (
                  <Component
                    chartList={chartList}
                    page={page}
                    totalPages={totalPages}
                    setPage={setPage}
                  />
                )}
          </ScrollArea>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default ViewPatientEncounters;
