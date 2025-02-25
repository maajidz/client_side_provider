import DocumentsClient from "@/components/documents/client";
import PageContainer from "@/components/layout/page-container";
// const breadcrumbItems = [
//   { title: "Dashboard", link: "/dashboard" },
//   { title: "Documents", link: "/dashboard/provider/documents" },
// ];
function DocumentsPage() {
  return (
    <PageContainer scrollable={true}>
      <DocumentsClient />
    </PageContainer>
  );
}

export default DocumentsPage;