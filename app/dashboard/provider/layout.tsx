//dashboard/provider/layout.tsx
import type { Metadata } from "next";
import Sidebar from "@/components/layout/sidebar";

export const metadata: Metadata = {
  title: "Provider Dashboard - Join Pomegaranate",
  description: "",
};

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-dvh">
      <Sidebar />
      <main className="w-full flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
