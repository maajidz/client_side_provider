//dashboard/layout.tsx
import Header from "@/components/layout/header";
import PatientSidebar from "@/components/patient/patientSidebar";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Patients - Join Pomegaranate",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <PatientSidebar userDetailsId={"97f41397-3fe3-4f0b-a242-d3370063db33"} />
      <main className="w-full flex-1 overflow-hidden">
        <Toaster />
          <Header />
        {children}
      </main>
    </div>
  );
}
