import InjectionOrders from "@/components/injections/injection-orders/InjectionOrders";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import ViewInjectionOrders from "./InjectionOrders/ViewInjectionOrders";
import ViewInjections from "./injections/ViewInjections";

const PatientInjections = ({ userDetailsId }: { userDetailsId: string }) => {
  return (
    <>
      <Tabs defaultValue="injections" className="w-full">
        <TabsList>
          <TabsTrigger value="injections">Injections</TabsTrigger>
          <TabsTrigger value="injection_orders">Injection Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="injections">
          <ViewInjections userDetailsId={userDetailsId} />
        </TabsContent>
        <TabsContent value="injection_orders" className="w-full">
          <>
            <div className="flex justify-end">
              <InjectionOrders />
            </div>
            <ViewInjectionOrders userDetailsId={userDetailsId} />
          </>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default PatientInjections;
