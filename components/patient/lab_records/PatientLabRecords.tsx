import Lab from '@/components/lab/Lab'
import React from 'react'

const PatientLabRecords = ({userDetailsId}: {userDetailsId: string}) => {
  return (
    <>
    {userDetailsId}
    <Lab/>
    </>
  )
}

export default PatientLabRecords