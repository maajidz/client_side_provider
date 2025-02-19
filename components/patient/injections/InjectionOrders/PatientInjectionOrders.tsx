import React, { useState } from "react";
import ViewInjectionOrders from "./ViewInjectionOrders";
import InjectionOrders from "@/components/injections/injection-orders/InjectionOrders";
import DefaultButton from "@/components/custom_buttons/buttons/DefaultButton";
import { PlusIcon } from "lucide-react";

const PatientInjectionOrders = ({
  userDetailsId,
}: {
  userDetailsId: string;
}) => {
  const [isInjectionDialogOpen, setIsInjectionDialogOpen] =
    useState<boolean>(false);
  const [injectionRefreshTrigger, setInjectionRefreshTrigger] =
    useState<number>(0);

  const handleInjectionDialogClose = () => {
    setIsInjectionDialogOpen(false);
    setInjectionRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex justify-end">
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
          onClose={() => handleInjectionDialogClose()}
        />
      </div>
      <ViewInjectionOrders
        refreshTrigger={injectionRefreshTrigger}
        userDetailsId={userDetailsId}
      />
    </div>
  );
};

export default PatientInjectionOrders;
