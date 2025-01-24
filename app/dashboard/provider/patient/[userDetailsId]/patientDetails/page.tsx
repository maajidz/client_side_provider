"use client";
import { Breadcrumbs } from "@/components/breadcrumbs";
import PageContainer from "@/components/layout/page-container";
import PatientDetails from "@/components/patient/patientDetails/PatientDetails";
import { Heading } from "@/components/ui/heading";
import { useParams } from "next/navigation";

function Page() {
  const { userDetailsId } = useParams();

  if (!userDetailsId || Array.isArray(userDetailsId)) {
    return <div>Error: User details ID not found</div>;
  }
  
  const breadcrumbItems = [
    { title: "Dashboard", link: "/dashboard" },
    { title: "Patients", link: "/dashboard/provider/patient" },
    {
      title: "Patient Details",
      link: `/dashboard/provider/patient/${userDetailsId}/patientDetails`,
    },
  ];

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <Heading title="Patient Details" description="" />
      </div>
      <PatientDetails userId={userDetailsId} />
    </PageContainer>
  );
}

export default Page;
