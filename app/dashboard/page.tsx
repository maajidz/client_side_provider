//dashboard
"use client";
import { Icons } from "@/components/icons";
import PageContainer from "@/components/layout/page-container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { navItems } from "@/constants/data";
import { RootState } from "@/store/store";
import Link from "next/link";
import { useSelector } from "react-redux";

export default function Page() {
  const providerDetails = useSelector((state: RootState) => state.login);
  return (
    <PageContainer scrollable={true}>
      <div className="space-y-2">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Hi, {providerDetails.firstName} {providerDetails.lastName} Welcome
            back 👋
          </h2>
          <div className="hidden items-center space-x-2 md:flex">
            {/* <CalendarDateRangePicker /> */}
            {/* <Button>Download</Button> */}
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics" disabled>
              Analytics
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-3 gap-3 items-center p-10 justify-items-center">
              {navItems.map((item, index) => {
                const Icon =
                  item.icon && Icons[item.icon as keyof typeof Icons];
                return (
                  <Link key={index} href={`${item.href}`}>
                    <div className="flex flex-col items-center gap-2 border border-[#84012A] rounded-2xl shadow-lg px-5 py-3 w-40">
                      {Icon && <Icon className="text-[#84012A]" />}
                      <div className="text-[#84012A] text-lg font-bold">
                        {item.title}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
