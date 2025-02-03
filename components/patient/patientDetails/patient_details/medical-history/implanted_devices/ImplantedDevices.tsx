import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import ImplantedDevicesDialog from "./ImplantedDevicesDialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const ImplantedDevices = ({userDetailsId}: {userDetailsId: string}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center p-4 text-lg font-semibold rounded-md bg-[#f0f0f0]">
        <span>Implanted Devices</span>
        <Button
          variant="ghost"
          className="text-blue-500 hover:text-blue-500 hover:bg-[#f0f0f0]"
          onClick={() => setIsOpen(true)}
        >
          Add
        </Button>
        <ImplantedDevicesDialog
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          userDetailsId={userDetailsId}
        />
      </div>
      <ScrollArea className="h-[12.5rem] min-h-10">
        <div>
            
        </div>
        {/* <ProceduresSurgeriesAndHospitalizationClient
          userDetailsId={userDetailsId}
        /> */}
      </ScrollArea>
    </div>
  );
};

export default ImplantedDevices;
