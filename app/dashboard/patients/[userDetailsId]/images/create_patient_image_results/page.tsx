//dashboard/patients/[userDetails]/image/create_patient_image-results
"use client";
import { Breadcrumbs } from "@/components/breadcrumbs";
import PageContainer from "@/components/layout/page-container";
import CreatePatientImageResults from "@/components/patient/images/patientImageResults/createPatientImageResults/CreatePatientImageResults";
import { useParams } from "next/navigation";

export default function PatientImageResults() {
  const { userDetailsId } = useParams();

  if (!userDetailsId || Array.isArray(userDetailsId)) {
    return <div>Error: User details ID not found</div>;
  }

  const breadcrumbItems = [
    { title: "Dashboard", link: "/dashboard" },
    { title: "Patients", link: "/dashboard/patients" },
    { title: "Images", link: `/dashboard/patients/${userDetailsId}/images` },
    {
      title: "Create Patient Image Results",
      link: `/dashboard/patients/${userDetailsId}/images/create_patient_image_results`,
    },
  ];

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <CreatePatientImageResults userDetailsId={userDetailsId} />
      </div>
    </PageContainer>
  );
}
