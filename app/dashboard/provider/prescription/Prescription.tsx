import CustomTabsTrigger from "@/components/custom_buttons/buttons/CustomTabsTrigger";
import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import PrescriptionsClient from "./prescriptions/client";
import ERxClient from "./erx/client";
import { useState } from "react";

function Prescription() {
  const [activeTab, setActiveTab] = useState("prescriptions");

  const prescriptionTab = [
    {
      value: "onBoarding",
      label: "Onboarding",
    },
    { value: "General-health", label: "General health" },
    {
      value: "Diabetes",
      label: "Diabetes",
    },
    {
      value: "cancel-subscription",
      label: "Cancel Subscription",
    },
  ];

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-2">
        <Tabs
          defaultValue={activeTab}
          onValueChange={(value) => setActiveTab(value)}
        >
          <div className="flex items-center justify-between border-b border-gray-300 pb-2">
            <TabsList>
              <CustomTabsTrigger value="prescriptions">
                Prescriptions
              </CustomTabsTrigger>
              <CustomTabsTrigger value="pharmacyRequests">
                Pharmacy Requests
              </CustomTabsTrigger>
              <CustomTabsTrigger value="eRxSent">eRx Sent</CustomTabsTrigger>
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
