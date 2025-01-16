import { Breadcrumbs } from "@/components/breadcrumbs";
import PageContainer from "@/components/layout/page-container";
import PatientDocuments from "@/components/patient/documents/PatientDocuments";
import { Heading } from "@/components/ui/heading";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Patients", link: "/dashboard/patients" },
  { title: "Documents", link: "" },
];
function page() {
  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <Heading title="Documents" description="" />
      </div>
      <PatientDocuments />
    </PageContainer>
  );
}

export default page;
