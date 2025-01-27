import React from "react";
import { navItems } from "@/constants/data";
import Link from "next/link";
import { Icons } from "@/components/icons";

const  DashboardBody = () => {
  return (
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
  );
};

export default DashboardBody;
