"use client";
import PageContainer from "@/components/layout/page-container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState } from "react";
import LabOrders from "./lab-orders/LabOrders";
import LabResults from "./lab-results/LabResults";

export default function Lab() {
  const [activeTab, setActiveTab] = useState("labResults");

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Tabs
          defaultValue="labResults"
          onValueChange={(value) => setActiveTab(value)}
        >
          <div className="flex items-center justify-between border-b border-gray-300 pb-2">
            <TabsList className="flex bg-transparent space-x-4">
              <TabsTrigger
                value="labResults"
                className="text-sm font-medium text-gray-700 border-b-2 border-transparent data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 hover:text-blue-600 hover:border-blue-600"
              >
                Lab Results
              </TabsTrigger>
              <TabsTrigger
                value="labOrders"
                className="text-sm font-medium text-gray-700 border-b-2 border-transparent data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 hover:text-blue-600 hover:border-blue-600"
              >
                Lab Orders
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value={activeTab}>
            {activeTab === "labResults" ? <LabResults /> : <LabOrders />}
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}

