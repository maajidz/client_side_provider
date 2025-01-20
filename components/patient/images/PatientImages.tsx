"use client"
import PageContainer from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import PatientImageResults from "@/components/patient/images/patientImageResults/PatientImageResults";
import PatientImageOrders from "./patientImageOrders/PatientImageOrders";

const PatientImages = ({ userDetailsId }: { userDetailsId: string }) => {
  const [activeTab, setActiveTab] = useState("imageResults");
  const router = useRouter();

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Tabs
          defaultValue="imageResults"
          onValueChange={(value) => setActiveTab(value)}
        >
          <div className="flex flex-row justify-between gap-10">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="imageResults">Image Results</TabsTrigger>
              <TabsTrigger value="imageOrders">Image Orders</TabsTrigger>
            </TabsList>
            <Button
              className="bg-[#84012A]"
              onClick={() =>
                router.push(
                  activeTab === "imageResults"
                    ? `/dashboard/patients/${userDetailsId}/images/create_patient_image_results`
                    : `/dashboard/patients/${userDetailsId}/images/create_patient_image_orders`
                )
              }
            >
              <div className="flex items-center gap-3">
                <PlusIcon />
                {activeTab === "imageResults"
                  ? "Image Results"
                  : "Image Orders"}
              </div>
            </Button>
          </div>
          <TabsContent value="imageResults">
            <PatientImageResults userDetailsId={userDetailsId} />
          </TabsContent>
          <TabsContent value="imageOrders">
            <PatientImageOrders userDetailsId={userDetailsId}/>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default PatientImages;
