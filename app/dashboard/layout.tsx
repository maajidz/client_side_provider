//dashboard/layout.tsx
import Header from "@/components/layout/header";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import Image from "next/image";
import imageUrl from "@/public/images/Logo_Red.svg";
import Link from "next/link";

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
    <div className="flex">
      {/* <Sidebar /> */}
      <main className="w-full flex-1 overflow-hidden">
        <Toaster />
        <div className="flex p-4">
          <Link href={"/dashboard"}>
            <Image src={imageUrl} alt={"logo"} height={24} priority />
          </Link>
          <Header />
        </div>
        {children}
      </main>
    </div>
  );
}
