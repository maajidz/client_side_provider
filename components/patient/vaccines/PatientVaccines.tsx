import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VaccineOrders from "@/components/injections/vaccine-orders/VaccineOrders";
import ViewVaccineOrders from "./vaccineOrders/ViewVaccineOrders";
import HistoricalVaccinesClient from "./vaccine-table/client";
import PageContainer from "@/components/layout/page-container";

const PatientVaccines = ({ userDetailsId }: { userDetailsId: string }) => {
  return (
    <PageContainer scrollable={true}>
      <Tabs defaultValue="vaccines" className="w-full">
        <TabsList>
          <TabsTrigger value="vaccines">Vaccines</TabsTrigger>
          <TabsTrigger value="vaccine_orders">Vaccine Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="vaccines">
          <HistoricalVaccinesClient userDetailsId={userDetailsId} />
        </TabsContent>
        <TabsContent value="vaccine_orders" className="w-full">
          <>
            <div className="flex justify-end">
              <VaccineOrders />
            </div>
            <ViewVaccineOrders userDetailsId={userDetailsId} />
          </>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
};

export default PatientVaccines;
