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
      <main className="flex-1 overflow-hidden flex flex gap-6 flex-col p-8 items-center">
        <div className="flex w-full">
            <SearchInput />
        </div>
        {children}
      </main>
    </div>
  );
}
