import { Breadcrumbs } from '@/components/breadcrumbs'
import PageContainer from '@/components/layout/page-container'
import { PatientAppointmentClient } from '@/components/tables/patient/patientAppointments/client';
import React from 'react'

const breadcrumbItems = [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Patient', link: '/dashboard/patient' },
    { title: 'Patient Appointments', link: '/dashboard/patient/appointments/' }
  ];

  const PatientAppointment = ({ params }: { params: { userDetailsId: string } }) => {
   
  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <PatientAppointmentClient userDetailsId={params.userDetailsId} /> 
      </div>
    </PageContainer>
  )
}

export default PatientAppointment