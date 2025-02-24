//dashboard/layout.tsx
import AccountIcon from "@/components/account/AccountIcon";
import { Toaster } from "@/components/ui/toaster";
import imageUrl from "@/public/images/Logo_Red.svg";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import AuthComponent from "@/components/AuthComponent";

export const metadata: Metadata = {
  title: "Provider - Join Pomegaranate",
  description: "Join Pomegaranate Provider",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-dvh">
      {/* <Sidebar /> */}
      <main className="w-full flex-1 overflow-hidden">
        <Toaster />
        <div className="flex justify-between items-center px-11 h-16 bg-[#FFEBF2]">
          <Link href={"/dashboard"}>
            <Image src={imageUrl} alt={"logo"} height={24} priority />
          </Link>
          <AccountIcon />
        </div>
        <AuthComponent>{children}</AuthComponent>
      </main>
    </div>
  );
}
