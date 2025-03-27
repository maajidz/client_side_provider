//dashboard/provider/labs
"use client";
// import { Breadcrumbs } from "@/components/breadcrumbs";
import PageContainer from "@/components/layout/page-container";
import Lab from "@/components/lab/Lab";

// const breadcrumbItems = [
//   { title: "Dashboard", link: "/dashboard" },
//   { title: "Labs", link: "/dashboard/provider/labs" },
// ];

export default function Labs() {
  return (
    <PageContainer>
      <div className="space-y-4">
        {/* <Breadcrumbs items={breadcrumbItems} /> */}
        <Lab />
      </div>
    </PageContainer>
  );
}
