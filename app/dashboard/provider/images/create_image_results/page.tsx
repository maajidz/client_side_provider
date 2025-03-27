//dashboard/image/create-image-results
"use client";
// import { Breadcrumbs } from "@/components/breadcrumbs";
import CreateImageResults from "@/components/images/ImageResults/CreateImageResults/CreateImageResults";
import PageContainer from "@/components/layout/page-container";

// const breadcrumbItems = [
//   { title: "Dashboard", link: "/dashboard" },
//   { title: "Images", link: "/dashboard/provider/images" },
//   {
//     title: "Create Image Results",
//     link: "/dashboard/provider/images/create_image_results",
//   },
// ];

export default function ImageResults() {
  return (
    <PageContainer>
      <div className="space-y-4">
        {/* <Breadcrumbs items={breadcrumbItems} /> */}
        <CreateImageResults />
      </div>
    </PageContainer>
  );
}
