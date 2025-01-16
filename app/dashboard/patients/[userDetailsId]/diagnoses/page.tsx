"use client";
import { Breadcrumbs } from "@/components/breadcrumbs";
import PageContainer from "@/components/layout/page-container";
import PatientDiagnoses from "@/components/patient/diagnoses/PatientDiagnoses";
import { Heading } from "@/components/ui/heading";
import { useParams } from "next/navigation";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Patients", link: "/dashboard/patients" },
  { title: "Diagnoses", link: "" },
];
function Page() {
  const { userDetailsId } = useParams();

  if (!userDetailsId || Array.isArray(userDetailsId)) {
    return <div>Error: User details ID not found</div>;
  }
  
  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <Heading title="Diagnoses" description="" />
      </div>
      <PatientDiagnoses userDetailsId={userDetailsId} />
    </PageContainer>
  );
}

export default Page;
