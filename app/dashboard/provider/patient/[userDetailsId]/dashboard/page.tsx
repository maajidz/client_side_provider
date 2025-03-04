"use client";

import PageContainer from "@/components/layout/page-container";
import PatientDashboard from "@/components/patient/dashboard/PatientDashboard";
import { useParams } from "next/navigation";

// const breadcrumbItems = [
//   { title: "Dashboard", link: "/dashboard" },
//   { title: "Patients", link: "/dashboard/provider/patient" },
//   { title: "Patient Dashboard", link: "" },
// ];

function Page() {
  const { userDetailsId } = useParams();

  if (!userDetailsId || Array.isArray(userDetailsId)) {
    return <div>Error: User details ID not found</div>;
  }
  return (
    <PageContainer>
      <PatientDashboard userDetailsId={userDetailsId} />
    </PageContainer>
  );
}

export default Page;
