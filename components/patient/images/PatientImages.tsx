import Images from '@/components/images/Images'
import React from 'react'

const PatientImages = ({userDetailsId}: {userDetailsId: string}) => {
  return (
    <>
    {userDetailsId}
    <Images />
    </>
  )
}

export default PatientImages