"use client";

import PageContainer from "@/components/layout/page-container";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import InjectionsClient from "./injection-orders/client";
import InjectionOrders from "./injection-orders/InjectionOrders";
import VaccinesClient from "./vaccine-orders/client";
import VaccineOrders from "./vaccine-orders/VaccineOrders";
import React, { useState } from "react";
import CustomTabsTrigger from "../custom_buttons/buttons/CustomTabsTrigger";
import DefaultButton from "../custom_buttons/buttons/DefaultButton";
import { PlusIcon } from "lucide-react";

function Injections() {
  const [activeTab, setActiveTab] = useState("injectionOrders");
  const [isInjectionDialogOpen, setIsInjectionDialogOpen] = useState(false);
  const [isVaccineDialogOpen, setIsVaccineDialogOpen] = useState(false);
  const [injectionRefreshTrigger, setInjectionRefreshTrigger] =
    useState<number>(0);
  const [vaccineRefreshTrigger, setVaccineRefreshTrigger] = useState<number>(0);

  const handleInjectionDialogClose = () => {
    setIsInjectionDialogOpen(false);
    setInjectionRefreshTrigger((prev) => prev + 1);
  };

  const handleVaccineDialogClose = () => {
    setIsVaccineDialogOpen(false);
    setVaccineRefreshTrigger((prev) => prev + 1);
  };

  const injectionsTab = [
    {
      value: "injectionOrders",
      label: "Injection Orders",
      component: InjectionsClient,
      refreshTrigger: injectionRefreshTrigger,
    },
    {
      value: "vaccineOrders",
      label: "Vaccine Orders",
      component: VaccinesClient,
      refreshTrigger: vaccineRefreshTrigger,
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
            {activeTab === "injectionOrders" ? (
              <>
                <DefaultButton
                  onClick={() => {
                    setIsInjectionDialogOpen(true);
                  }}
                >
                  <PlusIcon />
                  <div>Injection Order</div>
                </DefaultButton>
                <InjectionOrders
                  isOpen={isInjectionDialogOpen}
                  onClose={handleInjectionDialogClose}
                />
              </>
            ) : (
              <>
                <DefaultButton
                  onClick={() => {
                    setIsVaccineDialogOpen(true);
                  }}
                >
                  <PlusIcon />
                  <div>Vaccine Order</div>
                </DefaultButton>
                <VaccineOrders
                  isOpen={isVaccineDialogOpen}
                  onClose={handleVaccineDialogClose}
                />
              </>
            )}
          </div>
          <>
            {injectionsTab.map(
              ({ value, component: Component, refreshTrigger }) => (
                <TabsContent value={value} key={value}>
                  <Component refreshTrigger={refreshTrigger} />
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
