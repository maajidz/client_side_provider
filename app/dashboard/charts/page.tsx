//dashboard/calendar
"use client";
import { Breadcrumbs } from "@/components/breadcrumbs";
import PageContainer from "@/components/layout/page-container";
import { ChartsClient } from "@/components/tables/charts/client";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Charts", link: "/dashboard/charts" },
];
export default function Calendar() {
  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <ChartsClient />
      </div>
    </PageContainer>
  );
}
