//dashboard/qyestionnaire
'use client'
import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { CalendarClient } from '@/components/tables/calendar/client';



const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Calendar', link: '/dashboard/calendar' }
];
export default function Calendar() {
  
  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <CalendarClient />
      </div>
    </PageContainer>
  );
}
