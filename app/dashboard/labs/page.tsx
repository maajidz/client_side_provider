//dashboard/calendar
"use client";
import { Breadcrumbs } from "@/components/breadcrumbs";
import PageContainer from "@/components/layout/page-container";
import Lab from "./Lab";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Labs", link: "/dashboard/labs" },
];
export default function Labs() {
  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <Lab />
      </div>
    </PageContainer>
  );
}

