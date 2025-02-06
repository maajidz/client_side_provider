import GhostButton from "@/components/custom_buttons/GhostButton";
import React, { useState } from "react";
import ImplantedDevicesDialog from "./ImplantedDevicesDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import ImplantedDevicesClient from "./ImplantedDevicesClient";

const ImplantedDevices = ({userDetailsId}: {userDetailsId: string}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center p-4 text-lg font-semibold rounded-md bg-[#f0f0f0]">
        <span>Implanted Devices</span>
        <GhostButton label="Add" onClick={() => setIsOpen(true)}/>
        <ImplantedDevicesDialog
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          userDetailsId={userDetailsId}
        />
      </div>
      <ScrollArea className="h-[12.5rem] min-h-10">
        <div>
            
        </div>
        <ImplantedDevicesClient
          userDetailsId={userDetailsId}
        />
      </ScrollArea>
    </div>
  );
};

export default ImplantedDevices;
