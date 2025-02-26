"use client";


import FamilyHistory from "./family-history/FamilyHistory";
import ImplantedDevices from "./implanted_devices/ImplantedDevices";
import PastMedicalHistory from "./past-medical-history/PastMedicalHistory";
import ProceduresSurgeriesAndHospitalization from "./procedures/ProceduresSurgeriesAndHospitalization";
import SocialHistory from "./social-history/SocialHistory";
// import ImplantedDevices from "./implanted_devices/ImplantedDevices";

interface MedicalHistoryProps {
  userDetailsId: string;
}

function MedicalHistory({ userDetailsId }: MedicalHistoryProps) {
  return (
      <div className="flex flex-col gap-8 my-5 overflow-y-scroll h-[calc(100dvh-12rem)] pb-4">
        <ProceduresSurgeriesAndHospitalization userDetailsId={userDetailsId} />
        <PastMedicalHistory userDetailsId={userDetailsId} />
        <FamilyHistory userDetailsId={userDetailsId} />
        <SocialHistory userDetailsId={userDetailsId} />
        <ImplantedDevices userDetailsId={userDetailsId} />
      </div>
  );
}

export default MedicalHistory;
