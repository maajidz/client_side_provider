//dashboard/layout.tsx
import { Toaster } from "@/components/ui/toaster";
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
    <div className="flex h-dvh bg-[#F3EFF0]">
      {/* <Sidebar /> */}
      <main className="w-full flex-1 overflow-hidden">
        <Toaster />
        <AuthComponent>{children}</AuthComponent>
      </main>
    </div>
  );
}
