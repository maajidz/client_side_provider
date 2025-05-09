import React from "react";
import ReferralDialog from "./ReferralDialog";
import { UserEncounterData } from "@/types/chartsInterface";

const ReferralBosy = ({
  patientDetails,
  encounterId,
  signed,
}: {
  patientDetails: UserEncounterData;
  encounterId: string;
  signed: boolean;
}) => {
  return (
    <div className="flex justify-between pb-3">
      <label className="text-sm font-semibold">Referral</label>
      <div className="flex h-5 items-center space-x-4 text-sm">
        <ReferralDialog
          patientDetails={patientDetails}
          encounterId={encounterId}
          signed={signed}
        />
      </div>
    </div>
  );
};

export default ReferralBosy;
