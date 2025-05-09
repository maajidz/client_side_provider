"use client";
import PageContainer from "@/components/layout/page-container";
import PatientMedications from "@/components/patient/medications/PatientMedications";
import { useParams } from "next/navigation";

function Page() {
  const { userDetailsId } = useParams();

  if (!userDetailsId || Array.isArray(userDetailsId)) {
    return <div>Error: User details ID not found</div>;
  }
  return (
    <PageContainer>
      <PatientMedications userDetailsId={userDetailsId} />
    </PageContainer>
  );
}

export default Page;
