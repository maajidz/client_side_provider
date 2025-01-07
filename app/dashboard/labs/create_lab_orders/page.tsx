//dashboard/lab/create-lab-results
"use client";
import { Breadcrumbs } from "@/components/breadcrumbs";
import PageContainer from "@/components/layout/page-container";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Labs", link: "/dashboard/labs" },
  { title: "Create Lab Orders", link: "/dashboard/labs/create_lab_orders" },
];
export default function Labs() {
  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        {/* <CreateLabResults /> */}
      </div>
    </PageContainer>
  );
}
