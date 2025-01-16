import { Breadcrumbs } from "@/components/breadcrumbs";
import PageContainer from "@/components/layout/page-container";
import PatientReferrals from "@/components/patient/referrals/PatientReferrals";
import { Heading } from "@/components/ui/heading";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Patients", link: "/dashboard/patients" },
  { title: "Referrals", link: "" },
];
function page() {
  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <Heading title="Referrals" description="" />
      </div>
      <PatientReferrals />
    </PageContainer>
  );
}

export default page;
