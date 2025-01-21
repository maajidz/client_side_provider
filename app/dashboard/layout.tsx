//dashboard/layout.tsx
import Header from "@/components/layout/header";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import Image from "next/image";
import imageUrl from "@/public/images/Logo-white.png";
import Link from "next/link";
import Sidebar from "@/components/layout/sidebar";

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
      <Sidebar />
      <main className="w-full flex-1 overflow-hidden">
        <Toaster />
        <div className="flex p-4 bg-[#84012A]">
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
