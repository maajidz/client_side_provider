"use client";
import { Breadcrumbs } from "@/components/breadcrumbs";
import PageContainer from "@/components/layout/page-container";
import PatientDocuments from "@/components/patient/documents/PatientDocuments";
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
    { title: "Documents", link: `/dashboard/patients/${userDetailsId}/documents` },
  ];

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <Heading title="Documents" description="" />
      </div>
      <PatientDocuments userDetailsId={userDetailsId} />
    </PageContainer>
  );
}

export default Page;
