import { Breadcrumbs } from "@/components/breadcrumbs";
import PageContainer from "@/components/layout/page-container";
import PatientAuditTrails from "@/components/patient/audit_trails/PatientAuditTrails";
import { Heading } from "@/components/ui/heading";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Patients", link: "/dashboard/patients" },
  { title: "Audit Trails", link: "" },
];
function page() {
  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <Heading title="Audit Trails" description="" />
      </div>
      <PatientAuditTrails />
    </PageContainer>
  );
}

export default page;
