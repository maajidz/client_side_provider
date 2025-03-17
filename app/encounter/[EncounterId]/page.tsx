"use client";

import React, { useEffect, useState } from "react";
import SOAPSection from "@/components/charts/Encounters/SOAPSection";
import PreviewBody from "@/components/charts/Encounters/Preview/PreviewBody";
import DetailsBody from "@/components/charts/Encounters/Details/DetailsBody";
import { getUserEncounterDetails } from "@/services/chartsServices";
import LoadingButton from "@/components/LoadingButton";
import { UserEncounterData } from "@/types/chartsInterface";
import {
  ResizablePanelGroup,
  ResizablePanel,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

const Encounter = ({
  params,
}: {
  params: Promise<{ EncounterId: string }>;
}) => {
  const [encounterId, setEncounterId] = useState<string | null>(null);
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

  useEffect(() => {
    if (!encounterId) return;

    const fetchData = async () => {
      setLoading(true);

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
    };
    fetchData();
  }, [encounterId]);

  if (loading) {
    return (
      <div className="flex w-screen h-screen justify-center items-center">
        <LoadingButton />
      </div>
    );
  }

  if (!data) {
    return <div>{encounterId} No encounter data available.</div>;
  }

  return (
    <div className="flex flex-1 w-full flex-row bg-[#F3EFF0]">
      <DetailsBody patientDetails={data} encounterId={encounterId!} className="flex w-1/4" />
      <ResizablePanelGroup direction="horizontal" className="flex flex-1 gap-2 ">
        <ResizablePanel defaultSize={40}>
          <PreviewBody patientDetails={data} />
        </ResizablePanel>
        {/* <ResizableHandle>
          <ArrowBigLeft />
        </ResizableHandle> */}
        {isSOAPSectionVisible ? (
          <ResizablePanel className="flex flex-1"  defaultSize={60}>
            <SOAPSection
              encounterId={encounterId!}
              patientDetails={data}
              onClose={() => setIsSOAPSectionVisible(false)}
            />
          </ResizablePanel>
        ) : (
          <div className="flex h-full items-start bg-white shadow-lg">
            <Button variant={'outline'} className="px-2 h-full border-none" onClick={() => setIsSOAPSectionVisible(true)}>
              <Icon name="menu_open" />
            </Button>
          </div>
        )}
      </ResizablePanelGroup>
    </div>
  );
};

export default Encounter;
