"use client";

import PageContainer from "@/components/layout/page-container";
import PatientDocuments from "@/components/patient/documents/PatientDocuments";
import { useParams } from "next/navigation";

function Page() {
  const { userDetailsId } = useParams();

  if (!userDetailsId || Array.isArray(userDetailsId)) {
    return <div>Error: User details ID not found</div>;
  }
  return (
    <PageContainer>
      <PatientDocuments userDetailsId={userDetailsId} />
    </PageContainer>
  );
}

export default Page;
