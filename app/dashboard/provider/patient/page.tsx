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
      <div className="flex flex-col gap-10">
        <SearchInput />
        <Breadcrumbs items={breadcrumbItems} />
        <PatientClient />
      </div>
    </PageContainer>
  );
}
