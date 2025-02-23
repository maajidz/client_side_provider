'use client'
import PageContainer from "@/components/layout/page-container";
import PatientAppointments from "@/components/patient/appointments/PatientAppointments";
import { useParams } from "next/navigation";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Patients", link: "/dashboard/provider/patient" },
  { title: "Appointments", link: "" },
];

function Page() {
  const { userDetailsId } = useParams();

  if (!userDetailsId || Array.isArray(userDetailsId)) {
    return <div>Error: User details ID not found</div>;
  }

  return (
    <PageContainer scrollable={true}>
        {/* <Breadcrumbs items={breadcrumbItems} /> */}
        <PatientAppointments userDetailsId={userDetailsId} />
    </PageContainer>
  );
}

export default Page;
