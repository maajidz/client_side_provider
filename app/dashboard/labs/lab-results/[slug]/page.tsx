"use client";
import { Breadcrumbs } from "@/components/breadcrumbs";
import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { useParams } from "next/navigation";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Labs", link: "/dashboard/labs" },
  { title: "Selected Lab Result", link: "/dashboard/labs/lab-results" },
];

function SelectedLabResult() {
  const params = useParams();
  const { slug } = params;

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <Heading
          title="Selected Lab Result"
          description="Lab Result of the patient"
        />
        <h3> Patient Details: {slug}</h3>
      </div>
    </PageContainer>
  );
}

export default SelectedLabResult;


