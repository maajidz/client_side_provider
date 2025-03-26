import CustomTabsTrigger from "@/components/custom_buttons/buttons/CustomTabsTrigger";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import OrderRecords from "./orders/OrderRecords";
import ResultRecords from "./results/ResultRecords";

const PatientLabRecords = ({ userDetailsId }: { userDetailsId: string }) => {
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
      <Tabs defaultValue="labResults" className="flex flex-col gap-6">
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
