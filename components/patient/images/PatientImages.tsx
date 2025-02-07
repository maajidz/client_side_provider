"use client";
import PageContainer from "@/components/layout/page-container";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { PlusIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import PatientImageResults from "@/components/patient/images/patientImageResults/PatientImageResults";
import PatientImageOrders from "./patientImageOrders/PatientImageOrders";
import DefaultButton from "@/components/custom_buttons/buttons/DefaultButton";
import CustomTabsTrigger from "@/components/custom_buttons/buttons/CustomTabsTrigger";

const PatientImages = ({ userDetailsId }: { userDetailsId: string }) => {
  const [activeTab, setActiveTab] = useState("imageResults");
  const router = useRouter();

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
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Tabs
          defaultValue="imageResults"
          onValueChange={(value) => setActiveTab(value)}
        >
          <div className="flex flex-row justify-between gap-10">
            <TabsList className="grid w-full grid-cols-2">
              {patientImagesTab.map((tab) => (
                <CustomTabsTrigger value={tab.value} key={tab.value}>
                  {tab.label}
                </CustomTabsTrigger>
              ))}
            </TabsList>
            <DefaultButton
              onClick={() =>
                router.push(
                  activeTab === "imageResults"
                    ? `/dashboard/provider/patient/${userDetailsId}/images/create_patient_image_results`
                    : `/dashboard/provider/patient/${userDetailsId}/images/create_patient_image_orders`
                )
              }
            >
              <PlusIcon />
              {activeTab === "imageResults" ? "Image Results" : "Image Orders"}
            </DefaultButton>
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
