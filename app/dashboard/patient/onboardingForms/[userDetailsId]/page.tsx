//dashboard/qyestionnaire
'use client'
import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { PatientOnboardingFormClient } from '@/components/tables/patient/patientOnboardingForms/client';



const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Patient', link: '/dashboard/patient' },
  { title: 'Patient Forms', link: '/dashboard/patient/forms' }
];
export default function PatientFormPage({ params }: { params: { userDetailsId: string } }) {
  
  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <PatientOnboardingFormClient userDetailsId={params.userDetailsId} />
      </div>
    </PageContainer>
  );
}
