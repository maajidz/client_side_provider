//dashboard/provider/referral
"use client";
import { Breadcrumbs } from "@/components/breadcrumbs";
import PageContainer from "@/components/layout/page-container";
import Referral from "@/components/referral/Referral";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Referral", link: "/dashboard/provider/referral" },
];
export default function ReferralPage() {
  return (
    <PageContainer>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <Referral />
      </div>
    </PageContainer>
  );
}
