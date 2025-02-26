"use client";

import PageContainer from "@/components/layout/page-container";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import InjectionsClient from "./injection-orders/client";
import VaccinesClient from "./vaccine-orders/client";
import React, { useState } from "react";
import CustomTabsTrigger from "../custom_buttons/buttons/CustomTabsTrigger";

function Injections() {
  const [activeTab, setActiveTab] = useState("injectionOrders");

  const injectionsTab = [
    {
      value: "injectionOrders",
      label: "Injection Orders",
      component: InjectionsClient
    },
    {
      value: "vaccineOrders",
      label: "Vaccine Orders",
      component: VaccinesClient
    },
  ];

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-2">
        <Tabs
          defaultValue={activeTab}
          onValueChange={(value) => setActiveTab(value)}
        >
          <div className="flex items-center justify-between gap-10 pb-2">
            <TabsList className="flex gap-3 w-full">
              {injectionsTab.map((tab) => (
                <CustomTabsTrigger value={tab.value} key={tab.value}>
                  {tab.label}
                </CustomTabsTrigger>
              ))}
            </TabsList>
          </div>
          <>
            {injectionsTab.map(
              ({ value, component: Component }) => (
                <TabsContent value={value} key={value}>
                  <Component />
                </TabsContent>
              )
            )}
          </>
        </Tabs>
      </div>
    </PageContainer>
  );
}

export default Injections;
