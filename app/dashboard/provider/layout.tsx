//dashboard/provider/layout.tsx
import type { Metadata } from "next";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

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
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 overflow-hidden flex gap-6 flex-col p-8 items-center bg-gray-50">
        {children}
      </main>
    </SidebarProvider>
  );
}

{
  /* <div className="relative flex h-dvh"></div> */
}
