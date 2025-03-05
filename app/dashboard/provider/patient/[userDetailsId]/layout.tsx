//dashboard/provider/patient/[userDetailsId]/patientDetails/layout.tsx
"use client";

import { useParams } from "next/navigation";
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
    <div className="flex flex-col w-full gap-8">
      <PatientHeader userId={userDetailsId} />
      <div className="flex gap-4">
        <PatientSidebar userDetailsId={userDetailsId} />
        <main className="w-full flex flex-1 items-start">
          <Toaster />
          {/* <Header /> */}
          {children}
        </main>
      </div>
    </div>
  );
}
