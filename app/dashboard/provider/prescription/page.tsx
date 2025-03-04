"use client";
import { Breadcrumbs } from "@/components/breadcrumbs";
import PageContainer from "@/components/layout/page-container";
import Prescription from "./Prescription";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Prescription", link: "/dashboard/provider/prescription" },
];
function PrescriptionPage() {
  return (
    <PageContainer>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <Prescription />
      </div>
    </PageContainer>
  );
}

export default PrescriptionPage;
