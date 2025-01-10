//dashboard/lab/create-image-results
"use client";
import { Breadcrumbs } from "@/components/breadcrumbs";
import CreateImageResults from "@/components/images/ImageResults/CreateImageResults/CreateImageResults";
import PageContainer from "@/components/layout/page-container";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Images", link: "/dashboard/images" },
  { title: "Create Image Results", link: "/dashboard/images/create_image_results" },
];
export default function Labs() {
  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <CreateImageResults />
      </div>
    </PageContainer>
  );
}
