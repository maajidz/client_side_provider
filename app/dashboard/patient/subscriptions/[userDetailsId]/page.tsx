import { Breadcrumbs } from '@/components/breadcrumbs'
import PageContainer from '@/components/layout/page-container'
import { PatientSubscriptionClient } from '@/components/tables/patient/patientSubscription/client';
import React from 'react'

const breadcrumbItems = [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Patient', link: '/dashboard/patient' },
    { title: 'Patient Subscription', link: '/dashboard/patient/subscriptions/' }
  ];


const PatientSubscription = ({ params }: { params: { userDetailsId: string } }) => {
    return (
      <PageContainer scrollable={true}>
        <div className="space-y-4">
          <Breadcrumbs items={breadcrumbItems} />
          <PatientSubscriptionClient userDetailsId={params.userDetailsId}/>
        </div>
      </PageContainer>
    )
  }

export default PatientSubscription