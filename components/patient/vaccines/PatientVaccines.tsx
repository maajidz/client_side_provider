import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import HistoricalVaccinesClient from "./vaccine-table/client";
import PageContainer from "@/components/layout/page-container";
import CustomTabsTrigger from "@/components/custom_buttons/buttons/CustomTabsTrigger";
import PatientVaccineOrders from "./vaccineOrders/PatientVaccineOrders";

const PatientVaccines = ({ userDetailsId }: { userDetailsId: string }) => {
  const patientVaccineTab = [
    {
      value: "vaccines",
      label: "Vaccines",
      component: HistoricalVaccinesClient,
    },
    {
      value: "vaccine_orders",
      label: "Vaccine Orders",
      component: PatientVaccineOrders,
    },
  ];

  return (
    <PageContainer scrollable={true}>
      <Tabs defaultValue="vaccines" className="">
        <TabsList className="flex gap-3 w-full">
          {patientVaccineTab.map((tab) => (
            <CustomTabsTrigger value={tab.value} key={tab.value}>
              {tab.label}
            </CustomTabsTrigger>
          ))}
        </TabsList>
        {patientVaccineTab.map(({ value, component: Component }) => (
          <TabsContent value={value} key={value}>
            {Component ? <Component userDetailsId={userDetailsId} /> : value}
          </TabsContent>
        ))}
      </Tabs>
    </PageContainer>
  );
};

export default PatientVaccines;
