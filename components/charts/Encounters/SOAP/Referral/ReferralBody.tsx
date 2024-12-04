import React from 'react'
import ReferralDialog from './ReferralDialog'

const ReferralBosy = () => {
  return (
    <div className='flex justify-between pb-3'>
                <div>Referral</div>
                <div className="flex h-5 items-center space-x-4 text-sm">
                    <ReferralDialog />
                </div>
            </div>
  )
}

export default ReferralBosy