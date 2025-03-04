//dashboard/qyestionnaire
"use client";
import { Breadcrumbs } from "@/components/breadcrumbs";
import AppointmentForm from "@/components/calendar/Availability/availabilty_body";
import PageContainer from "@/components/layout/page-container";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Calendar", link: "/dashboard/provider/calendar" },
  { title: "Availability", link: "/dashboard/provider/calendar/availability" },
];
export default function Calendar() {
  return (
    <PageContainer>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <AppointmentForm />
      </div>
    </PageContainer>
  );
}
