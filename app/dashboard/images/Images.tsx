"use client";

import PageContainer from "@/components/layout/page-container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingButton from "@/components/LoadingButton";
import { getUserEncounterDetails } from "@/services/chartsServices";
import { UserEncounterData } from "@/types/chartsInterface";
import AddImageOrder from "./image-orders/AddImageOrder";
import AddImageResult from "./image-results/AddImageResult";
import { useEffect, useState } from "react";
import ImageOrdersClient from "./image-orders/orders/client";
import { Heading } from "@/components/ui/heading";

function Images() {
  const [activeTab, setActiveTab] = useState("imageResults");
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<UserEncounterData>();

  const encounterId = "34044ece-aad6-41f9-ac2b-f322a246043f";

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

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Tabs
          defaultValue="imageResults"
          onValueChange={(value) => setActiveTab(value)}
        >
          <div className="flex items-center justify-between border-b border-gray-300 pb-2">
            <TabsList>
              <TabsTrigger value="imageResults">Image Results</TabsTrigger>
              <TabsTrigger value="imageOrders">Image Orders</TabsTrigger>
            </TabsList>
            {activeTab === "imageResults" ? (
              <AddImageResult patientDetails={data} />
            ) : (
              <AddImageOrder />
            )}
          </div>
          <TabsContent value="imageResults">
            <Heading title="Image Results" description="" />
          </TabsContent>
          <TabsContent value="imageOrders">
            <ImageOrdersClient patientDetails={data} />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}

export default Images;

