//dashboard/provider/charts
"use client";
// import { Breadcrumbs } from "@/components/breadcrumbs";
import PageContainer from "@/components/layout/page-container";
import { ChartsClient } from "@/components/tables/charts/client";

// const breadcrumbItems = [
//   { title: "Dashboard", link: "/dashboard" },
//   { title: "Charts", link: "/dashboard/provider/charts" },
// ];

export default function Calendar() {
  return (
    <PageContainer>
      <div className="space-y-4">
        {/* <Breadcrumbs items={breadcrumbItems} /> */}
        <ChartsClient />
      </div>
    </PageContainer>
  );
}
