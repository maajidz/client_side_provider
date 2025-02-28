'use client'
import PageContainer from "@/components/layout/page-container";
import PatientMedications from "@/components/patient/medications/PatientMedications";
import { Heading } from "@/components/ui/heading";
import { useParams } from "next/navigation";

function Page() {
    const { userDetailsId } = useParams();
  
    if (!userDetailsId || Array.isArray(userDetailsId)) {
      return <div>Error: User details ID not found</div>;
    }
  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Heading title="Medications" description="" />
      </div>
      <PatientMedications userDetailsId={userDetailsId} />
    </PageContainer>
  );
}

export default Page;
