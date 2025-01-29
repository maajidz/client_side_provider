"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import FamilyHistory from "./family-history/FamilyHistory";
import PastMedicalHistory from "./past-medical-history/PastMedicalHistory";
import ProceduresSurgeriesAndHospitalization from "./procedures/ProceduresSurgeriesAndHospitalization";
import SocialHistory from "./social-history/SocialHistory";

interface MedicalHistoryProps {
  userDetailsId: string;
}

function MedicalHistory({ userDetailsId }: MedicalHistoryProps) {
  return (
    <ScrollArea className="h-[12.5rem] min-h-10">
      <div className="flex flex-col">
        <ProceduresSurgeriesAndHospitalization userDetailsId={userDetailsId} />
        <PastMedicalHistory userDetailsId={userDetailsId} />
        <FamilyHistory userDetailsId={userDetailsId} />
        <SocialHistory userDetailsId={userDetailsId} />
      </div>
    </ScrollArea>
  );
}

export default MedicalHistory;
