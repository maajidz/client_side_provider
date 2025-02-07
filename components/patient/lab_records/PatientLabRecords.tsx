import PageContainer from "@/components/layout/page-container";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import OrderRecords from "./orders/OrderRecords";
import ResultRecords from "./results/ResultRecords";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DefaultButton from "@/components/custom_buttons/buttons/DefaultButton";
import CustomTabsTrigger from "@/components/custom_buttons/buttons/CustomTabsTrigger";

const PatientLabRecords = ({ userDetailsId }: { userDetailsId: string }) => {
  const [activeTab, setActiveTab] = useState<string>("labResults");
  const router = useRouter();

  const patientLabsTab = [
    {
      value: "labResults",
      label: "Lab Results",
      component: ResultRecords,
    },
    {
      value: "labOrders",
      label: "Lab Orders",
      component: OrderRecords,
    },
  ];

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Tabs
          defaultValue="labResults"
          onValueChange={(value) => setActiveTab(value)}
        >
          <div className="flex flex-row justify-between gap-10">
            <TabsList className="flex gap-3 w-full">
              {patientLabsTab.map((tab) => (
                <CustomTabsTrigger value={tab.value} key={tab.value}>
                  {tab.label}
                </CustomTabsTrigger>
              ))}
            </TabsList>
            <DefaultButton
              onClick={() =>
                router.push(
                  activeTab === "labResults"
                    ? `/dashboard/provider/patient/${userDetailsId}/lab_records/create-lab-result`
                    : `/dashboard/provider/patient/${userDetailsId}/lab_records/create-lab-order`
                )
              }
            >
              <PlusIcon />
              {activeTab === "labResults" ? "Lab Results" : "Lab Orders"}
            </DefaultButton>
          </div>
          {patientLabsTab.map(({ value, component: Component }) => (
            <TabsContent value={value} key={value}>
              {Component ? <Component userDetailsId={userDetailsId} /> : value}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default PatientLabRecords;
