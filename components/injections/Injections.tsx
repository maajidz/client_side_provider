"use client";

import PageContainer from "@/components/layout/page-container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InjectionsClient from "./injection-orders/client";
import InjectionOrders from "./injection-orders/InjectionOrders";
import VaccinesClient from "./vaccine-orders/client";
import VaccineOrders from "./vaccine-orders/VaccineOrders";
import { useState } from "react";

function Injections() {
  const [activeTab, setActiveTab] = useState("injectionOrders");

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-2">
        <Tabs
          defaultValue={activeTab}
          onValueChange={(value) => setActiveTab(value)}
        >
          <div className="flex items-center justify-between gap-10 border-b border-gray-300 pb-2">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="injectionOrders">
                Injection Orders
              </TabsTrigger>
              <TabsTrigger value="vaccineOrders">Vaccine Orders</TabsTrigger>
            </TabsList>
            {activeTab === "injectionOrders" ? (
              <InjectionOrders />
            ) : (
              <VaccineOrders />
            )}
          </div>
          <TabsContent value="injectionOrders">
            <InjectionsClient />
          </TabsContent>
          <TabsContent value="vaccineOrders">
            <VaccinesClient />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}

export default Injections;

