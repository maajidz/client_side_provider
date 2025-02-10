//dashboard/provider/messages
"use client";
import { Breadcrumbs } from "@/components/breadcrumbs";
import PageContainer from "@/components/layout/page-container";
import MessageBody from "@/components/messages/MessageBody";
import { Heading } from "@/components/ui/heading";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Messages", link: "/dashboard/provider/messages" },
];
export default function Message() {
  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <Heading title="Messages" description="" />
      </div>
      <MessageBody />
    </PageContainer>
  );
}
