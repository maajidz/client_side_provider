import Referral from '@/components/referral/Referral'
import React from 'react'

const PatientReferrals = ({userDetailsId}: {userDetailsId: string}) => {
  return (
    <>
    {userDetailsId}
    <Referral />
    </>
  )
}

export default PatientReferrals