//dashboard/provider/layout.tsx
"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SearchPatients } from "@/components/dashboard/SearchInput";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { usePathname } from "next/navigation";

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const path = usePathname();
  const breadcrumbItems = [
    { title: "Dashboard", link: "/dashboard" },
    { title: `${path.split("/")[3]}`, link: `${path}` },
    {title: path.split("/")[4] ? `${path.split("/")[4]}` : "" , link: `${path}`}
  ];

  return (
    <SidebarProvider className="relative flex h-screen">
      <AppSidebar />
      <main className="w-full max-h-screen overflow-y-scroll flex gap-6 flex-col p-8 my-8 mr-8 border border-[#E9DFE9] items-center bg-white rounded-xl">
        <div className="flex flex-row gap-3 w-full items-center">
          <div className="w-96">
            <Breadcrumbs items={breadcrumbItems} />
          </div>
          <SearchPatients />
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}

{
  /* <div className="relative flex h-dvh"></div> */
}
