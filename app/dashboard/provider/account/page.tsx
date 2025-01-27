import Account from "@/components/account/Account";
import PageContainer from "@/components/layout/page-container";

function page() {
  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Account />
      </div>
    </PageContainer>
  );
}

export default page;