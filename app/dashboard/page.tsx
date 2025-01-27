//dashboard

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { SearchInput } from "@/components/dashboard/SearchInput";
import { Icons } from "@/components/icons";
import PageContainer from "@/components/layout/page-container";
import { navItems } from "@/constants/data";
import { UserPlus } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-col justify-center items-center gap-3 p-10">
        <DashboardHeader />
        <div className="flex gap-2 items-center">
          <SearchInput />
          <Link href={`/dashboard/provider/patient/add_patient`}>
            <UserPlus size={25} className="text-[#84012A]" />
          </Link>
        </div>
        <div className="grid grid-cols-5 gap-6 justify-center items-center p-10">
          {navItems.map((item, index) => {
            const Icon = item.icon && Icons[item.icon as keyof typeof Icons];
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
      </div>
    </PageContainer>
  );
}
