"use client";

// import { Breadcrumbs } from "@/components/breadcrumbs";
import PageContainer from "@/components/layout/page-container";
import Images from "@/components/images/Images";

// const breadcrumbItems = [
//   { title: "Dashboard", link: "/dashboard" },
//   { title: "Images", link: "/dashboard/provider/images" },
// ];

function ImagesPage() {
  return (
    <PageContainer>
      <div className="space-y-4">
        {/* <Breadcrumbs items={breadcrumbItems} /> */}
        <Images />
      </div>
    </PageContainer>
  );
}

export default ImagesPage;
