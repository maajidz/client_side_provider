"use client";

import React, { useCallback, useEffect, useState } from "react";
import SOAPSection from "@/components/charts/Encounters/SOAPSection";
import PreviewBody from "@/components/charts/Encounters/Preview/PreviewBody";
import DetailsBody from "@/components/charts/Encounters/Details/DetailsBody";
import { getUserEncounterDetails } from "@/services/chartsServices";
import LoadingButton from "@/components/LoadingButton";
import { UserEncounterData } from "@/types/chartsInterface";
import { ResizablePanelGroup, ResizablePanel } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Breadcrumbs } from "@/components/breadcrumbs";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "All Encounters", link: "/encounter" },
  { title: "Encounter Details", link: "/encounter/[EncounterId]" },
];

const Encounter = ({
  params,
}: {
  params: Promise<{ EncounterId: string }>;
}) => {
  const [encounterId, setEncounterId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<UserEncounterData>();
  const [isSOAPSectionVisible, setIsSOAPSectionVisible] =
    useState<boolean>(true);

  useEffect(() => {
    const unwrapParams = async () => {
      if (!encounterId) {
        const resolvedParams = await params;
        setEncounterId(resolvedParams.EncounterId);
      }
    };
    unwrapParams();
  }, [params, encounterId]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    if (!encounterId) return;
    try {
      const encounterData = await getUserEncounterDetails({
        encounterId: encounterId,
      });
      if (encounterData !== undefined && encounterData) {
        setData(encounterData[0]);
      }
    } catch (e) {
      console.log("Error", e);
    } finally {
      setLoading(false);
    }
  }, [encounterId]);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshKey]);

  if (loading) {
    return (
      <div className="flex w-screen h-screen justify-center items-center">
        <LoadingButton />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex w-screen h-screen justify-center items-center font-semibold text-lg">
        No encounter data available.
      </div>
    );
  }

  return (
    <div className="flex flex-1 w-full flex-row bg-[#F3EFF0]">
      <div className="flex flex-col gap-1 w-1/4">
        <div className="flex px-4 pt-6">
          <Breadcrumbs items={breadcrumbItems} />
          {/* <div className="flex flex-row gap-2">
            <Button variant={"outline"}>
              <Icon name="arrow_back" />
            </Button>
          </div> */}
        </div>
        <DetailsBody
          patientDetails={data}
          encounterId={encounterId!}
        />
      </div>
      <ResizablePanelGroup
        direction="horizontal"
        className="flex flex-1 gap-2 "
      >
        <ResizablePanel defaultSize={40}>
          <PreviewBody patientDetails={data} />
        </ResizablePanel>
        {/* <ResizableHandle>
          <ArrowBigLeft />
        </ResizableHandle> */}
        {isSOAPSectionVisible ? (
          <ResizablePanel className="flex flex-1" defaultSize={60}>
            <SOAPSection
              encounterId={encounterId!}
              patientDetails={data}
              onClose={() => setIsSOAPSectionVisible(false)}
              onRefresh={setRefreshKey}
            />
          </ResizablePanel>
        ) : (
          <div className="flex h-full items-start bg-white shadow-lg">
            <Button
              variant={"outline"}
              className="px-2 h-full items-start border-none"
              onClick={() => setIsSOAPSectionVisible(true)}
            >
              <Icon name="menu_open" />
            </Button>
          </div>
        )}
      </ResizablePanelGroup>
    </div>
  );
};

export default Encounter;
