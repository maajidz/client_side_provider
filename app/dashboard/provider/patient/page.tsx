//dashboard/provider/patient
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SearchInput } from "@/components/dashboard/SearchInput";
import PageContainer from "@/components/layout/page-container";
import { PatientClient } from "@/components/tables/patient/client";
const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Patients", link: "/dashboard/provider/patient" },
];
export default function Patients() {
  return (
    <PageContainer>
        <Breadcrumbs items={breadcrumbItems} />
        <SearchInput />
        <PatientClient />
    </PageContainer>
  );
}
