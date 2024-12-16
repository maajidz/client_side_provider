import React from 'react'
import ReferralDialog from './ReferralDialog'
import { UserEncounterData } from '@/types/chartsInterface'

const ReferralBosy = ({patientDetails, encounterId}: {patientDetails: UserEncounterData, encounterId: string}) => {
  return (
    <div className='flex justify-between pb-3'>
                <div>Referral</div>
                <div className="flex h-5 items-center space-x-4 text-sm">
                    <ReferralDialog patientDetails={patientDetails} encounterId={encounterId}/>
                </div>
            </div>
  )
}

export default ReferralBosy