"use client";
import PageContainer from "@/components/layout/page-container";
import PatientAllergies from "@/components/patient/allergies/PatientAllergies";
import { useParams } from "next/navigation";

function Page() {
  const { userDetailsId } = useParams();

  if (!userDetailsId || Array.isArray(userDetailsId)) {
    return <div>Error: User details ID not found</div>;
  }

  return (
    <PageContainer scrollable={true}>
      <PatientAllergies userDetailsId={userDetailsId} />
    </PageContainer>
  );
}

export default Page;
