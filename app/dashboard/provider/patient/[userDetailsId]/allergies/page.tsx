"use client";
import PageContainer from "@/components/layout/page-container";
import PatientAllergies from "@/components/patient/allergies/PatientAllergies";
import { useParams } from "next/navigation";

// const breadcrumbItems = [
//   { title: "Dashboard", link: "/dashboard" },
//   { title: "Patients", link: "/dashboard/provider/patient" },
//   { title: "Allergies", link: "" },
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
      <PatientAllergies userDetailsId={userDetailsId}/>
    </PageContainer>
  );
}

export default Page;
