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
<<<<<<< HEAD
      <main className="w-full overflow-y-scroll  max-h-[calc(100dvh-4rem)] flex gap-6 flex-col p-8 my-8 mr-8 border border-[#E9DFE9] items-center bg-white rounded-xl">
=======
      <main className="w-full max-h-screen overflow-y-scroll flex gap-6 flex-col p-8 my-8 mr-8 border border-[#E9DFE9] items-center bg-white rounded-xl">
>>>>>>> 5c353e5 (Added UI Styles - Badges, Indicators and Misc fixes)
        {children}
      </main>
    </SidebarProvider>
  );
}

{
  /* <div className="relative flex h-dvh"></div> */
}
