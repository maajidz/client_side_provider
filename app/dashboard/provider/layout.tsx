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
    <SidebarProvider className="relative flex h-screen">
      <AppSidebar />
      <main className="w-full max-h-screen overflow-y-scroll flex gap-6 flex-col p-8 my-8 mr-8 border border-[#E9DFE9] items-center bg-white rounded-xl ">
        {children}
      </main>
    </SidebarProvider>
  );
}

{
  /* <div className="relative flex h-dvh"></div> */
}
