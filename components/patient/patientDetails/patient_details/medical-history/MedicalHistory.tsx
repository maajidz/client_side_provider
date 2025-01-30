"use client";

import FamilyHistory from "./family-history/FamilyHistory";
import PastMedicalHistory from "./past-medical-history/PastMedicalHistory";
import ProceduresSurgeriesAndHospitalization from "./procedures/ProceduresSurgeriesAndHospitalization";
import SocialHistory from "./social-history/SocialHistory";

interface MedicalHistoryProps {
  userDetailsId: string;
}

function MedicalHistory({ userDetailsId }: MedicalHistoryProps) {
  return (
    <div className="mb-5">
      <ProceduresSurgeriesAndHospitalization userDetailsId={userDetailsId} />
      <PastMedicalHistory userDetailsId={userDetailsId} />
      <FamilyHistory userDetailsId={userDetailsId} />
      <SocialHistory userDetailsId={userDetailsId} />
    </div>
  );
}

export default MedicalHistory;
