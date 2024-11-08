import React from 'react'
import { Breadcrumbs } from '@/components/breadcrumbs'
import PageContainer from '@/components/layout/page-container';
import PatientDetails from '@/components/patient/PatientDetails';


const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Patient', link: '/dashboard/patient' },
  { title: 'Patient Details', link: '' }
];

const PatientDetailsPage = ({ params }: 
  { params: { userDetailsId: string } }) => {
  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <PatientDetails userId={params.userDetailsId} />
      </div>
    </PageContainer >
  )
}

export default PatientDetailsPage