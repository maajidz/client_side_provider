import React, { useState } from "react";
import ViewInjectionOrders from "./ViewInjectionOrders";
import InjectionOrders from "@/components/injections/injection-orders/InjectionOrders";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="w-full flex flex-col">
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setIsInjectionDialogOpen(true);
          }}
        >
          <PlusIcon />
          Injection Order
        </Button>
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
