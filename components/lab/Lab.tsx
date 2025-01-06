"use client";
import PageContainer from "@/components/layout/page-container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useEffect, useState } from "react";
import LabOrders from "./LabOrders/LabOrders";
import LabResults from "./LabResults/LabResults";
import { UserEncounterData } from "@/types/chartsInterface";
import { getUserEncounterDetails } from "@/services/chartsServices";
import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Lab() {
  const [activeTab, setActiveTab] = useState<string>("labResults");
  const encounterId = "34044ece-aad6-41f9-ac2b-f322a246043f";
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<UserEncounterData>();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const encounterData = await getUserEncounterDetails({
          encounterId,
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
  }, []);

  if (loading) {
    return (
      <div className="flex w-screen h-screen justify-center items-center">
        <LoadingButton />
      </div>
    );
  }

  if (!data) {
    return <div> No encounter data available.</div>;
  }

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Tabs
          defaultValue="labResults"
          className=""
          onValueChange={(value) => setActiveTab(value)}
        >
          <div className="flex flex-row justify-between gap-10">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="labResults">Lab Results</TabsTrigger>
              <TabsTrigger value="labOrders">Lab Orders</TabsTrigger>
            </TabsList>
            <Button
              className="bg-[#84012A]"
              onClick={() => {
                if (activeTab === "labResults") {
                  router.push("/dashboard/labs/create_lab_results");
                } else {
                  router.push("/dashboard/labs");
                }
              }}
            >
              <div className="flex items-center gap-3">
                <PlusIcon />
                {activeTab === "labResults" ? "Lab Results" : "Lab Orders"}
              </div>
            </Button>
          </div>
          <TabsContent value="labResults">
            <LabResults patientDetails={data} />
          </TabsContent>
          <TabsContent value="labOrders">
            <LabOrders patientDetails={data} />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
