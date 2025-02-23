//dashboard/provider/patient
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SearchInput } from "@/components/dashboard/SearchInput";
import PageContainer from "@/components/layout/page-container";
import { PatientClient } from "@/components/tables/patient/client";
import { Search } from "lucide-react";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Patients", link: "/dashboard/provider/patient" },
];
export default function Patients() {
  return (
    <PageContainer>
        <SearchInput />
        <Breadcrumbs items={breadcrumbItems} />
        <PatientClient />
    </PageContainer>
  );
}
