import { Breadcrumbs } from "@/components/breadcrumbs";
import DocumentsClient from "@/components/documents/client";
import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Documents", link: "/dashboard/provider/documents" },
];
function DocumentsPage() {
  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <Heading title="Documents" description="" />
        <DocumentsClient />
      </div>
    </PageContainer>
  );
}

export default DocumentsPage;