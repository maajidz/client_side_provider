'use client'
import PageContainer from "@/components/layout/page-container";
import PatientQuickNotes from "@/components/patient/quick_notes/PatientQuickNotes";
import { useParams } from "next/navigation";

// const breadcrumbItems = [
//   { title: "Dashboard", link: "/dashboard" },
//   { title: "Patients", link: "/dashboard/provider/patient" },
//   { title: "Notes", link: "" },
// ];
function Page() {
  const { userDetailsId } = useParams();
  
    if (!userDetailsId || Array.isArray(userDetailsId)) {
      return <div>Error: User details ID not found</div>;
    }
    
    return (
    <PageContainer scrollable={true}>
      {/* <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
      </div> */}
      <PatientQuickNotes userDetailsId={userDetailsId}/>
    </PageContainer>
  );
}

export default Page;
