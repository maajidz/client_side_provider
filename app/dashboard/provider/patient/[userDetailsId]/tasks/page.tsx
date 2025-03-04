"use client";
import PageContainer from "@/components/layout/page-container";
import PatientTasks from "@/components/patient/tasks/PatientTasks";
import { useParams } from "next/navigation";

function Page() {
  const { userDetailsId } = useParams();

  if (!userDetailsId || Array.isArray(userDetailsId)) {
    return <div>Error: User details ID not found</div>;
  }

  return (
    <PageContainer>
      <PatientTasks userDetailsId={userDetailsId} />
    </PageContainer>
  );
}

export default Page;
