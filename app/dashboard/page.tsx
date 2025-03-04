//dashboard
"use client";
import { useRouter } from "next/navigation";
import { SearchInput } from "@/components/dashboard/SearchInput";
import { Icons } from "@/components/icons";
import PageContainer from "@/components/layout/page-container";
import { navItems } from "@/constants/data";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import imageUrl from "@/public/images/Logo_Red.svg";
import Image from "next/image";
import AccountIcon from "@/components/account/AccountIcon";
import { Badge } from "@/components/ui/badge";

const validBadgeVariants = [
  "warning",
  "blue",
  "default",
  "secondary",
  "destructive",
  "outline",
  "ghost",
  "indigo",
  "purple",
  "pink",
  "success",
] as const;
type BadgeVariant = (typeof validBadgeVariants)[number];

export default function DashboardPage() {
  const router = useRouter();

  const isValidBadgeVariant = (value: string): value is BadgeVariant =>
    validBadgeVariants.includes(value as BadgeVariant);

  return (
    <main className="w-full h-screen flex-1 overflow-hidden bg-gray-100">
      <div className="flex justify-between items-center px-11 h-16">
        <Link href={"/dashboard"}>
          <Image src={imageUrl} alt={"logo"} height={24} priority />
        </Link>
        <AccountIcon />
      </div>
      <PageContainer>
        <div className="flex flex-col max-w-5xl items-center gap-3 w-full self-center">
          <div className="flex w-full gap-2 items-end py-8 justify-between">
            <SearchInput />
            <Button
              variant="outline"
              onClick={() =>
                router.push("/dashboard/provider/patient/add_patient")
              }
              className="h-11 text-gray-600 font-semibold"
            >
              Add Patient
              <Plus size={20} className="" />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-3 justify-center items-center w-full">
            {navItems.map((item, index) => {
              const Icon = item.icon && Icons[item.icon as keyof typeof Icons];
              const BadgeIcon =
                item.badgeIcon && Icons[item.badgeIcon as keyof typeof Icons];
              return (
                <Link key={index} href={`${item.href}`}>
                  <div className="flex flex-col gap-3 justify-center border border-gray-200 px-6 rounded-lg w-full h-24 text-gray-900 hover:bg-pink-50 hover:border-pink-200 hover:text-[#84012a] hover:shadow-sm hover:shadow-pink-100 transition-all">
                    {Icon && <Icon className="" />}
                    <div className="flex justify-between">
                      <div className="text-md font-semibold">{item.title}</div>
                      {/* <Badge variant={`${item.badgeColor}`}>
                        <div className="flex rounded-3xl w-fit flex-row items-center font-semibold text-[.7rem] gap-1">
                          {BadgeIcon && <BadgeIcon size={14} strokeWidth={3} />}
                          {item.badgeLabel}
                        </div>
                      </Badge> */}
                      {item.badgeColor &&
                        isValidBadgeVariant(item.badgeColor) && (
                          <Badge variant={item.badgeColor}>
                            <div className="flex rounded-3xl w-fit flex-row items-center font-semibold text-[.7rem] gap-1">
                              {BadgeIcon && (
                                <BadgeIcon size={14} strokeWidth={3} />
                              )}
                              {item.badgeLabel}
                            </div>
                          </Badge>
                        )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </PageContainer>
    </main>
  );
}
