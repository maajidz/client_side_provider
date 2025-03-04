//dashboard/provider/patient/add_patient

import { Breadcrumbs } from "@/components/breadcrumbs";
import PageContainer from "@/components/layout/page-container";
import AddPatientBody from "@/components/patient/add_patient/AddPatientBody";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Patients", link: "/dashboard/provider/patient" },
  { title: "Add Patient", link: "/dashboard/provider/patient/add_patient" },
];
export default function AddPatient() {
  return (
    <>
      <PageContainer>
        <div className="space-y-4">
          <Breadcrumbs items={breadcrumbItems} />
          <AddPatientBody />
        </div>
      </PageContainer>
    </>
  );
}
