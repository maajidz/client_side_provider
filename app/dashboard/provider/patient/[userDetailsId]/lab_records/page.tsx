"use client";
import PageContainer from "@/components/layout/page-container";
import PatientLabRecords from "@/components/patient/lab_records/PatientLabRecords";
import { useParams } from "next/navigation";

function Page() {
  const { userDetailsId } = useParams();

  if (!userDetailsId || Array.isArray(userDetailsId)) {
    return <div>Error: User details ID not found</div>;
  }
  // const breadcrumbItems = [
  //   { title: "Dashboard", link: "/dashboard" },
  //   { title: "Patients", link: "/dashboard/provider/patient" },
  //   {
  //     title: "Lab Records",
  //     link: `/dashboard/provider/patient/${userDetailsId}/lab_records`,
  //   },
  // ];

  return (
    <PageContainer scrollable={true}>
      {/* <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
      </div> */}
      <PatientLabRecords userDetailsId={userDetailsId} />
    </PageContainer>
  );
}

export default Page;
