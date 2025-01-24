import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PrescriptionsClient from "./prescriptions/client";
import ERxClient from "./erx/client";
import { useState } from "react";

function Prescription() {
  const [activeTab, setActiveTab] = useState("prescriptions");

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-2">
        <Tabs
          defaultValue={activeTab}
          onValueChange={(value) => setActiveTab(value)}
        >
          <div className="flex items-center justify-between border-b border-gray-300 pb-2">
            <TabsList>
              <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
              <TabsTrigger value="pharmacyRequests">
                Pharmacy Requests
              </TabsTrigger>
              <TabsTrigger value="eRxSent">eRx Sent</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="prescriptions">
            <PrescriptionsClient />
          </TabsContent>
          <TabsContent value="pharmacyRequests">
            <Heading title="Pharmacy Requests" description="" />
          </TabsContent>
          <TabsContent value="eRxSent">
            <ERxClient />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}

export default Prescription;

