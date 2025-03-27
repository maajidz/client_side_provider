//dashboard/lab/create-lab-results
"use client";
// import { Breadcrumbs } from "@/components/breadcrumbs";
import CreateLabOrders from "@/components/lab/LabOrders/CreateLabOrders/CreateLabOrders";
import PageContainer from "@/components/layout/page-container";

// const breadcrumbItems = [
//   { title: "Dashboard", link: "/dashboard" },
//   { title: "Labs", link: "/dashboard/provider/labs" },
//   {
//     title: "Create Lab Orders",
//     link: "/dashboard/provider/labs/create_lab_orders",
//   },
// ];

export default function Labs() {
  return (
    <PageContainer>
      <div className="space-y-4">
        {/* <Breadcrumbs items={breadcrumbItems} /> */}
        <CreateLabOrders />
      </div>
    </PageContainer>
  );
}
