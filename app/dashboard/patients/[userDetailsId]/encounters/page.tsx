import { Breadcrumbs } from "@/components/breadcrumbs";
import PageContainer from "@/components/layout/page-container";
import PatientEncounters from "@/components/patient/encounters/PatientEncounters";
import { Heading } from "@/components/ui/heading";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Patients", link: "/dashboard/patients" },
  { title: "Encounters", link: "" },
];
function page() {
  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <Heading title="Encounters" description="" />
      </div>
      <PatientEncounters />
    </PageContainer>
  );
}

export default page;
