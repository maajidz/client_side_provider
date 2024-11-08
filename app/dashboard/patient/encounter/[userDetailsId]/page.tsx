//dashboard/qyestionnaire
'use client'
import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import imageUrl from "@/public/images/encounter.png"
import Image from "next/image";



const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Patient', link: '/dashboard/patient' },
  { title: 'Patient Encounters', link: '/dashboard/patient/encounter' }
];
export default function PatientEncounterPage() {
  
  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <div>
        <Image alt='Loading...' src={imageUrl} className='rounded-t-2xl' />
        </div>
      </div>
    </PageContainer>
  );
}
