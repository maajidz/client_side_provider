"use client";
import PageContainer from "@/components/layout/page-container";
import ViewPatientTasks from "@/components/patient/tasks/ViewPatientTasks";
import { useParams } from "next/navigation";

function Page() {
  const { userDetailsId } = useParams();

  if (!userDetailsId || Array.isArray(userDetailsId)) {
    return <div>Error: User details ID not found</div>;
  }

  return (
    <PageContainer>
      <ViewPatientTasks userDetailsId={userDetailsId} />
    </PageContainer>
  );
}

export default Page;
