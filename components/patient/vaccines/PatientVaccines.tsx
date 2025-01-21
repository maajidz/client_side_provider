import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import VaccinesDialog from "@/components/charts/Encounters/Details/Vaccines/VaccinesDialog";
import VaccineOrders from "@/components/injections/vaccine-orders/VaccineOrders";
import ViewVaccineOrders from "./vaccineOrders/ViewVaccineOrders";

const PatientVaccines = ({ userDetailsId }: { userDetailsId: string }) => {
  const [isVaccinesDialogOpen, setIsVaccinesDialogOpen] = useState<boolean>(false);
  // const [isVaccinesOrdersDialogOpen, setIsVaccineOrdersDialogOpen] = useState<boolean>(false);
  return (
    <>
      <Tabs defaultValue="vaccines" className="w-full">
        <TabsList>
          <TabsTrigger value="vaccines">Vaccines</TabsTrigger>
          <TabsTrigger value="vaccine_orders">Vaccine Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="vaccines">
          <>
            <div className="flex justify-end">
              <Button
                className="bg-[#84012A]"
                onClick={() => {
                  setIsVaccinesDialogOpen(true);
                }}
              >
                <div className="flex gap-2">
                  <PlusIcon />
                  Vaccines
                </div>
              </Button>
              <VaccinesDialog
                userDetailsId={userDetailsId}
                isOpen={isVaccinesDialogOpen}
                onClose={() => {
                  setIsVaccinesDialogOpen(false);
                }}
              />
            </div>
            
          </>
        </TabsContent>
        <TabsContent value="vaccine_orders" className="w-full">
          <>
            <div className="flex justify-end">
              <VaccineOrders />
            </div> 
            <ViewVaccineOrders userDetailsId={userDetailsId} />
          </>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default PatientVaccines;
