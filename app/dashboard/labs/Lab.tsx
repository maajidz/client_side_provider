"use client";
import PageContainer from "@/components/layout/page-container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useEffect, useState } from "react";
import LabOrders from "./lab-orders/LabOrders";
import LabResults from "./lab-results/LabResults";
import { UserEncounterData } from "@/types/chartsInterface";
import { getUserEncounterDetails } from "@/services/chartsServices";
import LoadingButton from "@/components/LoadingButton";

export default function Lab() {
  const [activeTab, setActiveTab] = useState("labResults");
  const encounterId = "34044ece-aad6-41f9-ac2b-f322a246043f";

  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<UserEncounterData>();
  useState<boolean>(true);

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
          onValueChange={(value) => setActiveTab(value)}
        >
          <div className="flex items-center justify-between border-b border-gray-300 pb-2">
            <TabsList className="flex bg-transparent space-x-4">
              <TabsTrigger
                value="labResults"
                className="text-sm font-medium text-gray-700 border-b-2 border-transparent data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 hover:text-blue-600 hover:border-blue-600"
              >
                Lab Results
              </TabsTrigger>
              <TabsTrigger
                value="labOrders"
                className="text-sm font-medium text-gray-700 border-b-2 border-transparent data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 hover:text-blue-600 hover:border-blue-600"
              >
                Lab Orders
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value={activeTab}>
            {activeTab === "labResults" ? <LabResults patientDetails={data} /> : <LabOrders patientDetails={data} />}
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}

