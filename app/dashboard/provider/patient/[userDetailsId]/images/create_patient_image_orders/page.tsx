///dashboard/provider/patient/[userDetails]/image/create_patient_image_orders
"use client";
import { Breadcrumbs } from "@/components/breadcrumbs";
import PageContainer from "@/components/layout/page-container";
import CreatePatientImageOrders from "@/components/patient/images/patientImageOrders/createPatientImageOrders/CreatePatientImageOrders";
import { useParams } from "next/navigation";

export default function PatientImageOrders() {
  const { userDetailsId } = useParams();

  if (!userDetailsId || Array.isArray(userDetailsId)) {
    return <div>Error: User details ID not found</div>;
  }

  const breadcrumbItems = [
    { title: "Dashboard", link: "/dashboard" },
    { title: "Patients", link: "/dashboard/provider/patient" },
    {
      title: "Images",
      link: `/dashboard/provider/patient/${userDetailsId}/images`,
    },
    {
      title: "Create Patient Image Orders",
      link: `/dashboard/provider/patient/${userDetailsId}/images/create_patient_image_orders`,
    },
  ];

  return (
    <PageContainer>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <CreatePatientImageOrders userDetailsId={userDetailsId} />
      </div>
    </PageContainer>
  );
}
