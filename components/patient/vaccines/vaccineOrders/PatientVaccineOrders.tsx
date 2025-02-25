import React, { useState } from "react";
import ViewVaccineOrders from "./ViewVaccineOrders";
import VaccineOrders from "@/components/injections/vaccine-orders/VaccineOrders";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const PatientVaccineOrders = ({ userDetailsId }: { userDetailsId: string }) => {
  const [isVaccineDialogOpen, setIsVaccineDialogOpen] =
    useState<boolean>(false);

  return (
    <div className="w-full">
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setIsVaccineDialogOpen(true);
          }}
        >
          <PlusIcon />
          <div>Vaccine Order</div>
        </Button>
        <VaccineOrders
          onClose={() => setIsVaccineDialogOpen(false)}
          isOpen={isVaccineDialogOpen}
        />
      </div>
      <ViewVaccineOrders userDetailsId={userDetailsId} />
    </div>
  );
};

export default PatientVaccineOrders;
