"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import AddImagesDrawer from "@/components/charts/Encounters/SOAP/Images/AddImagesDrawer";
import PastImageOrders from "@/components/charts/Encounters/SOAP/Images/PastImageOrders";

const CreatePatientImageOrders = ({
  userDetailsId,
}: {
  userDetailsId: string;
}) => {
  const router = useRouter();

  return (
    <>
      <div>
        <div className="flex justify-between">
          Add Image Orders
          <div className="flex gap-3">
            <Button
              variant={"outline"}
              className="border border-[#84012A] text-[#84012A]"
              onClick={() => {
                router.replace(
                  `/dashboard/provider/patient/${userDetailsId}/images`
                );
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
        <div className="flex h-5 items-center py-5 text-sm">
          <AddImagesDrawer userDetailsId={userDetailsId} />
          <Separator orientation="vertical" />
          <PastImageOrders userDetailsId={userDetailsId} />
        </div>
      </div>
    </>
  );
};

export default CreatePatientImageOrders;
