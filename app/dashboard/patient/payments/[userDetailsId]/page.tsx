import React from 'react'
import { Breadcrumbs } from '@/components/breadcrumbs'
import PageContainer from '@/components/layout/page-container'
import { PatientPaymentClient } from '@/components/tables/patient/patientPayments/client';


const breadcrumbItems = [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Patient', link: '/dashboard/patient' },
    { title: 'Patient Payment', link: '/dashboard/patient/payments/' }
  ];

const PatientPayment = ({ params }: { params: { userDetailsId: string } }) => {
  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <PatientPaymentClient userDetailsId={params.userDetailsId}/>
      </div>
    </PageContainer>
  )
}

export default PatientPayment