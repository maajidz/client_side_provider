import React, { useState } from "react";
import ViewVaccineOrders from "./ViewVaccineOrders";
import VaccineOrders from "@/components/injections/vaccine-orders/VaccineOrders";
import DefaultButton from "@/components/custom_buttons/buttons/DefaultButton";
import { PlusIcon } from "lucide-react";

const PatientVaccineOrders = ({ userDetailsId }: { userDetailsId: string }) => {
  const [isVaccineDialogOpen, setIsVaccineDialogOpen] =
    useState<boolean>(false);

  return (
    <div className="w-full">
      <div className="flex justify-end">
        <DefaultButton
          onClick={() => {
            setIsVaccineDialogOpen(true);
          }}
        >
          <PlusIcon />
          <div>Vaccine Order</div>
        </DefaultButton>
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
