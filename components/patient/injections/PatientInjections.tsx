import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import React from "react";
import ViewInjections from "./injections/ViewInjections";
import PatientInjectionOrders from "./InjectionOrders/PatientInjectionOrders";
import CustomTabsTrigger from "@/components/custom_buttons/buttons/CustomTabsTrigger";
import { Heading } from "@/components/ui/heading";

const PatientInjections = ({ userDetailsId }: { userDetailsId: string }) => {
  const patientInjectionsTab = [
    { value: "injections", label: "Injections", component: ViewInjections },
    {
      value: "injection_orders",
      label: "Injection Orders",
      component: PatientInjectionOrders,
    },
  ];
  return (
    <>
    <div className="flex flex-col gap-6 mb-6">
      <Heading title="Injections"/>
      <Tabs defaultValue="injections" className="">
        <TabsList className="flex gap-3 w-full">
          {patientInjectionsTab.map((tab) => (
            <CustomTabsTrigger value={tab.value} key={tab.value}>
              {tab.label}
            </CustomTabsTrigger>
          ))}
        </TabsList>
        {patientInjectionsTab.map(({ value, component: Component }) => (
          <TabsContent value={value} key={value}>
            {Component ? <Component userDetailsId={userDetailsId} /> : value}
          </TabsContent>
        ))}
      </Tabs>
      </div>
    </>
  );
};

export default PatientInjections;
