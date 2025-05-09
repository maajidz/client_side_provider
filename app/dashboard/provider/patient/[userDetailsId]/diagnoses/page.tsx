"use client";
import PageContainer from "@/components/layout/page-container";
import PatientDiagnoses from "@/components/patient/diagnoses/PatientDiagnoses";
import { useParams } from "next/navigation";

function Page() {
  const { userDetailsId } = useParams();

  if (!userDetailsId || Array.isArray(userDetailsId)) {
    return <div>Error: User details ID not found</div>;
  }

  return (
    <PageContainer>
      <PatientDiagnoses userDetailsId={userDetailsId} />
    </PageContainer>
  );
}

export default Page;
