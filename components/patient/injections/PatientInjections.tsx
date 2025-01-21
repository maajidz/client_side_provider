import InjectionOrders from "@/components/injections/injection-orders/InjectionOrders";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState } from "react";
import ViewInjectionOrders from "./InjectionOrders/ViewInjectionOrders";
import ViewInjections from "./injections/ViewInjections";
import { Button } from "@/components/ui/button";
import InjectionsDialog from "@/components/charts/Encounters/Details/Injections/InjectionsDialog";
import { PlusIcon } from "lucide-react";

const PatientInjections = ({ userDetailsId }: { userDetailsId: string }) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  return (
    <>
      <Tabs defaultValue="injections" className="w-full">
        <TabsList>
          <TabsTrigger value="injections">Injections</TabsTrigger>
          <TabsTrigger value="injection_orders">Injection Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="injections">
          <>
            <div className="flex justify-end">
              <Button
                className="bg-[#84012A]"
                onClick={() => {
                  setIsDialogOpen(true);
                }}
              >
                <div className="flex gap-2">
                  <PlusIcon />
                  Injections
                </div>
              </Button>
              <InjectionsDialog
                userDetailsId={userDetailsId}
                isOpen={isDialogOpen}
                onClose={() => {
                  setIsDialogOpen(false);
                }}
              />
            </div>
            <ViewInjections userDetailsId={userDetailsId} />
          </>
        </TabsContent>
        <TabsContent value="injection_orders" className="w-full">
          <>
            <div className="flex justify-end">
              <InjectionOrders />
            </div>
            <ViewInjectionOrders userDetailsId={userDetailsId} />
          </>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default PatientInjections;
