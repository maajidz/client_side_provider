import React from 'react'
import { Breadcrumbs } from '@/components/breadcrumbs'
import PageContainer from '@/components/layout/page-container'
import { PatientMedicationsClient } from '@/components/tables/patient/patientMedications/client';


const breadcrumbItems = [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Patient', link: '/dashboard/patient' },
    { title: 'Patient Medications', link: '/dashboard/patient/medications/' }
  ];

const PatientPayment = ({ params }: { params: { userDetailsId: string } }) => {
  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <PatientMedicationsClient userDetailsId={params.userDetailsId}/>
      </div>
    </PageContainer>
  )
}

export default PatientPayment