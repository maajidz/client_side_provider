//dashboard
"use client";

import { Icons } from "@/components/icons";
import PageContainer from "@/components/layout/page-container";
import { navItems } from "@/constants/data";
import { RootState } from "@/store/store";
import Link from "next/link";
import { useSelector } from "react-redux";

export default function Page() {
  const providerDetails = useSelector((state: RootState) => state.login);
  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-col gap-3 p-10">
        <h2 className="text-2xl font-bold text-center">
          Hi, {providerDetails.firstName} {providerDetails.lastName} Welcome
          back 👋
        </h2>
      </div>
      <div className="grid grid-cols-4 gap-3 items-center p-10 justify-items-center">
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
    </PageContainer>
  );
}
