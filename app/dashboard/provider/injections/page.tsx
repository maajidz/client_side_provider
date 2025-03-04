import { Breadcrumbs } from "@/components/breadcrumbs";
import Injections from "@/components/injections/Injections";
import PageContainer from "@/components/layout/page-container";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Injections", link: "/dashboard/provider/injections" },
];

function InjectionsPage() {
  return (
    <PageContainer>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <Injections />
      </div>
    </PageContainer>
  );
}

export default InjectionsPage;
