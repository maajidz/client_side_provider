"use client";
import PageContainer from "@/components/layout/page-container";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import React from "react";
import LabOrders from "./LabOrders/LabOrders";
import LabResults from "./LabResults/LabResults";
import CustomTabsTrigger from "../custom_buttons/buttons/CustomTabsTrigger";

const labTab = [
  {
    value: "labResults",
    label: "Lab Results",
    component: LabResults,
  },
  {
    value: "labOrders",
    label: "Lab Orders",
    component: LabOrders,
  },
];

export default function Lab() {
  return (
    <PageContainer>
      <div className="space-y-2">
        <Tabs defaultValue="labResults">
          <div className="flex items-center justify-between border-b border-gray-300 pb-2">
            <TabsList>
              {labTab.map((tabs) => (
                <CustomTabsTrigger value={tabs.value} key={tabs.value}>
                  {tabs.label}
                </CustomTabsTrigger>
              ))}
            </TabsList>
          </div>
          {labTab.map(({ value, component: Component }) => (
            <TabsContent value={value} key={value}>
              <Component />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </PageContainer>
  );
}
