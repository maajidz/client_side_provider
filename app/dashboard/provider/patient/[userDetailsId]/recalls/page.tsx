"use client";
import PageContainer from "@/components/layout/page-container";
import ViewRecalls from "@/components/patient/recalls/ViewRecalls";
import { useParams } from "next/navigation";

function Page() {
  const { userDetailsId } = useParams();

  if (!userDetailsId || Array.isArray(userDetailsId)) {
    return <div>Error: User details ID not found</div>;
  }
  return (
    <PageContainer>
      <ViewRecalls userDetailsId={userDetailsId} />
    </PageContainer>
  );
}

export default Page;
