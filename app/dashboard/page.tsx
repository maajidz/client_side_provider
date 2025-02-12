//dashboard
"use client"
import { useRouter } from "next/navigation";
import { SearchInput } from "@/components/dashboard/SearchInput";
import { Icons } from "@/components/icons";
import PageContainer from "@/components/layout/page-container";
import { navItems } from "@/constants/data";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Page() {
  const router = useRouter();
  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-col max-w-5xl items-center gap-3 w-full">
        <div className="flex w-full gap-2 items-end py-8 justify-between">
          <SearchInput />
          <Button variant="ghost" onClick={()=> router.push("/dashboard/provider/patient/add_patient")} className="hover:bg-cyan-50 hover:text-cyan-600 text-cyan-600 text-sm font-medium flex w-fit items-center gap-1 h-11 data-[state=active]:border-red-500">
            Add Patient
            <Plus size={20} className="text-cyan-600" />
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-3 justify-center items-center w-full">
          {navItems.map((item, index) => {
            const Icon = item.icon && Icons[item.icon as keyof typeof Icons];
            return (
              <Link key={index} href={`${item.href}`}>
                <div className="flex flex-col gap-3 justify-center border border-gray-200 px-6 rounded-lg w-full h-24 text-gray-900 hover:bg-pink-50 hover:border-pink-200 hover:text-[#84012a] hover:shadow-sm hover:shadow-pink-100 transition-all">
                  {Icon && <Icon className="" />}
                  <div className="text-md font-semibold">
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
