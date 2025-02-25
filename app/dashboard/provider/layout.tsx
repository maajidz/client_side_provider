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
    <div className="relative flex flex-1 h-full">
      <Sidebar />
      <main className="flex-1 h-full overflow-hidden flex gap-6 flex-col p-8 my-8 mr-8 border border-[#E9DFE9] items-center bg-white rounded-xl">
        {children}
      </main>
    </div>
  );
}
