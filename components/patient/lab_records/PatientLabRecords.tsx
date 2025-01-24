import PageContainer from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrderRecords from "./orders/OrderRecords";
import ResultRecords from "./results/ResultRecords";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const PatientLabRecords = ({ userDetailsId }: { userDetailsId: string }) => {
  const [activeTab, setActiveTab] = useState<string>("labResults");
  const router = useRouter();

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Tabs
          defaultValue="labResults"
          onValueChange={(value) => setActiveTab(value)}
        >
          <div className="flex flex-row justify-between gap-10">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="labResults">Lab Results</TabsTrigger>
              <TabsTrigger value="labOrders">Lab Orders</TabsTrigger>
            </TabsList>
            <Button
              className="bg-[#84012A]"
              onClick={() =>
                router.push(
                  activeTab === "labResults"
                    ? `/dashboard/provider/patient/${userDetailsId}/lab_records/create-lab-result`
                    : `/dashboard/provider/patient/${userDetailsId}/lab_records/create-lab-order`
                )
              }
            >
              <div className="flex items-center gap-3">
                <PlusIcon />
                {activeTab === "labResults" ? "Lab Results" : "Lab Orders"}
              </div>
            </Button>
          </div>
          <TabsContent value="labResults">
            <ResultRecords userDetailsId={userDetailsId} />
          </TabsContent>
          <TabsContent value="labOrders">
            <OrderRecords userDetailsId={userDetailsId} />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default PatientLabRecords;
