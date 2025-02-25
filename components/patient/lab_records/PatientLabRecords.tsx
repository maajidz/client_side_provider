import CustomTabsTrigger from "@/components/custom_buttons/buttons/CustomTabsTrigger";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import OrderRecords from "./orders/OrderRecords";
import ResultRecords from "./results/ResultRecords";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";

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
      <div className="space-y-4">
        <div className="flex flex-row justify-between items-center">
          <Heading title="Lab Records" description="" />
          <Button
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
          </Button>
        </div>
        <Tabs
          defaultValue="labResults"
          onValueChange={(value) => setActiveTab(value)}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-row justify-between gap-10">
            <TabsList className="flex gap-3 w-full">
              {patientLabsTab.map((tab) => (
                <CustomTabsTrigger value={tab.value} key={tab.value}>
                  {tab.label}
                </CustomTabsTrigger>
              ))}
            </TabsList>
          </div>
          {patientLabsTab.map(({ value, component: Component }) => (
            <TabsContent value={value} key={value}>
              {Component ? <Component userDetailsId={userDetailsId} /> : value}
            </TabsContent>
          ))}
        </Tabs>
      </div>
  );
};

export default PatientLabRecords;