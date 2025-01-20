"use client";

import { Breadcrumbs } from "@/components/breadcrumbs";
import PageContainer from "@/components/layout/page-container";
import CreateResultRecord from "@/components/patient/lab_records/results/CreateResultRecord";
import { Heading } from "@/components/ui/heading";
import { useParams } from "next/navigation";

function Page() {
  const { userDetailsId } = useParams();

  if (!userDetailsId || Array.isArray(userDetailsId)) {
    return <div>Error: User details ID not found</div>;
  }

  const breadcrumbItems = [
    { title: "Dashboard", link: "/dashboard" },
    { title: "Patients", link: "/dashboard/patients" },
    {
      title: "Lab Records",
      link: `/dashboard/patients/${userDetailsId}/lab_records`,
    },
    {
      title: "Lab Result",
      link: `/dashboard/patients/${userDetailsId}/lab_records/create-lab-result`,
    },
  ];
  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <Heading title="Lab Result" description="" />
      </div>
      <CreateResultRecord />
    </PageContainer>
  );
}

export default Page;

