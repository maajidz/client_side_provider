//dashboard/provider/analytics
"use client";
import AnalyticsBody from "@/components/analytics/AnalyticsBody";
import { Breadcrumbs } from "@/components/breadcrumbs";
import PageContainer from "@/components/layout/page-container";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Analytics", link: "/dashboard/provider/analytics" },
];
export default function Calendar() {
  return (
    <PageContainer>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <AnalyticsBody />
      </div>
    </PageContainer>
  );
}
