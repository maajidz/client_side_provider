import PageContainer from "@/components/layout/page-container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrderRecords from "./orders/OrderRecords";
import ResultRecords from "./results/ResultRecords";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DefaultButton from "@/components/custom_buttons/buttons/DefaultButton";

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
