"use client";
import PageContainer from "@/components/layout/page-container";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import React from "react";
import PatientImageResults from "@/components/patient/images/patientImageResults/PatientImageResults";
import PatientImageOrders from "./patientImageOrders/PatientImageOrders";
import CustomTabsTrigger from "@/components/custom_buttons/buttons/CustomTabsTrigger";

const PatientImages = ({ userDetailsId }: { userDetailsId: string }) => {
  const patientImagesTab = [
    {
      value: "imageResults",
      label: "Image Results",
      component: PatientImageResults,
    },
    {
      value: "imageOrders",
      label: "Image Orders",
      component: PatientImageOrders,
    },
  ];

  return (
    <PageContainer>
      <div className="space-y-4">
        <Tabs defaultValue="imageResults">
          <div className="flex flex-row justify-between gap-10">
            <TabsList className="grid w-full grid-cols-2">
              {patientImagesTab.map((tab) => (
                <CustomTabsTrigger value={tab.value} key={tab.value}>
                  {tab.label}
                </CustomTabsTrigger>
              ))}
            </TabsList>
          </div>
          {patientImagesTab.map(({ value, component: Component }) => (
            <TabsContent value={value} key={value}>
              {Component ? <Component userDetailsId={userDetailsId} /> : value}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default PatientImages;
