//dashboard/lab/create-image-results
"use client";
// import { Breadcrumbs } from "@/components/breadcrumbs";
import CreateImageOrders from "@/components/images/ImageOrders/CreateImageOrders/CreateImageOrders";
import PageContainer from "@/components/layout/page-container";

// const breadcrumbItems = [
//   { title: "Dashboard", link: "/dashboard" },
//   { title: "Images", link: "/dashboard/provider/images" },
//   {
//     title: "Create Image Orders",
//     link: "/dashboard/provider/images/create_image_orders",
//   },
// ];

export default function Labs() {
  return (
    <PageContainer>
      <div className="space-y-4">
        {/* <Breadcrumbs items={breadcrumbItems} /> */}
        <CreateImageOrders />
      </div>
    </PageContainer>
  );
}
