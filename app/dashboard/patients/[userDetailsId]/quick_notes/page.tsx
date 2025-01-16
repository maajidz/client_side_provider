import { Breadcrumbs } from "@/components/breadcrumbs";
import PageContainer from "@/components/layout/page-container";
import PatientQuickNotes from "@/components/patient/quick_notes/PatientQuickNotes";
import { Heading } from "@/components/ui/heading";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Patients", link: "/dashboard/patients" },
  { title: "Quick Notes", link: "" },
];
function page() {
  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <Heading title="Quick Notes" description="" />
      </div>
      <PatientQuickNotes />
    </PageContainer>
  );
}

export default page;
