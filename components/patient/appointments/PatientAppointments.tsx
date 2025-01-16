import { PatientAppointmentClient } from '@/components/tables/patient/patientAppointments/client'
import React from 'react'

const PatientAppointments = ({userDetailsId}: {userDetailsId: string}) => {
  return (
    <>
    PATIENT APPOINTMENTS {userDetailsId}
    <PatientAppointmentClient userDetailsId={userDetailsId}/>
    </>
  )
}

export default PatientAppointments