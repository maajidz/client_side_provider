"use client";
import PageContainer from "@/components/layout/page-container";
import PatientEncounters from "@/components/patient/encounters/PatientEncounters";
import { useParams } from "next/navigation";

function Page() {
  const { userDetailsId } = useParams();

  if (!userDetailsId || Array.isArray(userDetailsId)) {
    return <div>Error: User details ID not found</div>;
  }

  return (
    <PageContainer>
      <PatientEncounters userDetailsId={userDetailsId} />
    </PageContainer>
  );
}

export default Page;
