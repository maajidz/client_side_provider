"use client";
import PageContainer from "@/components/layout/page-container";
import PatientDetails from "@/components/patient/patientDetails/PatientDetails";
import { useParams } from "next/navigation";

function Page() {
  const { userDetailsId } = useParams();

  if (!userDetailsId || Array.isArray(userDetailsId)) {
    return <div>Error: User details ID not found</div>;
  }

  return (
    <PageContainer>
      <PatientDetails userId={userDetailsId} />
    </PageContainer>
  );
}

export default Page;
