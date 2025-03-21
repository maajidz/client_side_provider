import React from 'react'
import FollowUpDialog from './FollowUpDialog'
import { UserEncounterData } from '@/types/chartsInterface'
import ViewFollowUps from './ViewFollowUps'


const FolllowUp = ({patientDetails, encounterId, signed}: {patientDetails: UserEncounterData, encounterId: string; signed: boolean; }) => {
    return (
      <div className="flex justify-between border-b pb-3">
        <label className="text-sm font-semibold">Follow Up</label>
        <div className="flex h-5 items-center space-x-4 text-sm">
          <FollowUpDialog
            patientDetails={patientDetails}
            encounterId={encounterId}
            signed={signed}
          />
          <ViewFollowUps
            patientDetails={patientDetails}
            encounterId={encounterId}
          />
        </div>
      </div>
    );
}

export default FolllowUp