//dashboard/provider/layout.tsx
import type { Metadata } from "next";
import Sidebar from "@/components/layout/sidebar";
import { SearchInput } from "@/components/dashboard/SearchInput";

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
    <div className="relative flex h-dvh">
      <Sidebar />
      <main className="w-full flex-1 overflow-hidden">
        <div className="absolute -top-[4.7rem] left-40 flex items-start pt-6 px-6">
          <div className="bg-white rounded-full">
            <SearchInput />
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
