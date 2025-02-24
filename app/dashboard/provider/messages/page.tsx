//dashboard/provider/messages
"use client";
import PageContainer from "@/components/layout/page-container";
import MessageBody from "@/components/messages/MessageBody";
import { Heading } from "@/components/ui/heading";

// const breadcrumbItems = [
//   { title: "Dashboard", link: "/dashboard" },
//   { title: "Messages", link: "/dashboard/provider/messages" },
// ];
export default function Message() {
  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 w-full h-full flex-col gap-6 rounded-xl p-6 bg-white">
        {/* <Breadcrumbs items={breadcrumbItems} /> */}
        <Heading title="Messages" description="" />
      </div>
      <MessageBody />
    </PageContainer>
  );
}
