"use client";

import PageContainer from "@/components/layout/page-container";
import PatientReferrals from "@/components/patient/referrals/PatientReferrals";
import { useParams } from "next/navigation";

function Page() {
  const { userDetailsId } = useParams();

  if (!userDetailsId || Array.isArray(userDetailsId)) {
    return <div>Error: User details ID not found</div>;
  }

  return (
    <PageContainer>
      <PatientReferrals userDetailsId={userDetailsId} />
    </PageContainer>
  );
}

export default Page;
