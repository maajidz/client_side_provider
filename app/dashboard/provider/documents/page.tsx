import { Breadcrumbs } from "@/components/breadcrumbs";
import DocumentsClient from "@/components/documents/client";
import PageContainer from "@/components/layout/page-container";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Documents", link: "/dashboard/provider/documents" },
];

function DocumentsPage() {
  return (
    <PageContainer>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <DocumentsClient />
      </div>
    </PageContainer>
  );
}

export default DocumentsPage;
