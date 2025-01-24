//dashboard/provider/calendar
'use client'
import { Breadcrumbs } from '@/components/breadcrumbs';
import { CalendarBody } from '@/components/calendar/CalendarBody';
import PageContainer from '@/components/layout/page-container';



const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Calendar', link: '/dashboard/provider/calendar' }
];
export default function Calendar() {
  
  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <CalendarBody />
      </div>
    </PageContainer>
  );
}
