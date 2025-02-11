"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import FamilyHistory from "./family-history/FamilyHistory";
import PastMedicalHistory from "./past-medical-history/PastMedicalHistory";
import ProceduresSurgeriesAndHospitalization from "./procedures/ProceduresSurgeriesAndHospitalization";
import SocialHistory from "./social-history/SocialHistory";
import ImplantedDevices from "./implanted_devices/ImplantedDevices";

interface MedicalHistoryProps {
  userDetailsId: string;
}

function MedicalHistory({ userDetailsId }: MedicalHistoryProps) {
  return (
    <ScrollArea className={cn("h-[calc(60dvh-52px)]")}>
      <div className="flex flex-col gap-5 my-5">
        <ProceduresSurgeriesAndHospitalization userDetailsId={userDetailsId} />
        <PastMedicalHistory userDetailsId={userDetailsId} />
        <FamilyHistory userDetailsId={userDetailsId} />
        <SocialHistory userDetailsId={userDetailsId} />
        <ImplantedDevices userDetailsId={userDetailsId} />
      </div>
    </ScrollArea>
  );
}

export default MedicalHistory;
