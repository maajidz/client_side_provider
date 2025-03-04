import CustomTabsTrigger from "@/components/custom_buttons/buttons/CustomTabsTrigger";
import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import PrescriptionsClient from "./prescriptions/client";
import ERxClient from "./erx/client";

const prescriptionTab = [
  {
    value: "prescriptions",
    label: "Prescriptions",
    component: PrescriptionsClient,
  },
  {
    value: "pharmacyRequests",
    label: "Pharmacy Requests",
    component: null,
  },
  {
    value: "eRxSent",
    label: "eRx Sent",
    component: ERxClient,
  },
];

function Prescription() {
  return (
    <PageContainer>
      <div className="space-y-2">
        <Tabs defaultValue="prescriptions">
          <div className="flex items-center justify-between border-b border-gray-300 pb-2">
            <TabsList>
              {prescriptionTab.map((tabs) => (
                <CustomTabsTrigger value={tabs.value} key={tabs.value}>
                  {tabs.label}
                </CustomTabsTrigger>
              ))}
            </TabsList>
          </div>
          {prescriptionTab.map(({ value, component: Component, label }) => (
            <TabsContent value={value} key={value}>
              {Component ? (
                <Component />
              ) : (
                <Heading title={label} description="" />
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </PageContainer>
  );
}

export default Prescription;
