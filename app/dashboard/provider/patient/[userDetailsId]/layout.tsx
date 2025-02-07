//dashboard/provider/patient/[userDetailsId]/patientDetails/layout.tsx
"use client";

import { useParams } from "next/navigation";
import Header from "@/components/layout/header";
import PatientSidebar from "@/components/patient/patientSidebar";
import { Toaster } from "@/components/ui/toaster";
import PatientHeader from "@/components/patient/patientDetails/patientHeader";
import { useRouter } from "next/navigation";

export default function PatientDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userDetailsId } = useParams();
  const router = useRouter();
  if (!userDetailsId || Array.isArray(userDetailsId)) {
    router.push("/dashboard");
    return null;
  }

  return (
    <div className="flex flex-col">
      <PatientHeader userId={userDetailsId} />
      <div className="flex">
        <PatientSidebar userDetailsId={userDetailsId} />
        <main className="w-full flex-1 h-[80%] ">
          <Toaster />
          <Header />
          {children}
        </main>
      </div>
    </div>
  );
}
