"use client";
import { Breadcrumbs } from "@/components/breadcrumbs";
import PatientMessages from "@/components/patient/messages/PatientMessages";
import { Heading } from "@/components/ui/heading";
import { useParams } from "next/navigation";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Patients", link: "/dashboard/provider/patient" },
  { title: "Messages", link: "" },
];
function Page() {
  const { userDetailsId } = useParams();

  if (!userDetailsId || Array.isArray(userDetailsId)) {
    return <div>Error: User details ID not found</div>;
  }
  return (
    <>
      <div className="flex flex-1 flex-col p-4 gap-4">
        <div className="flex flex-1 gap-4 flex-col">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading title="Messages" description="" />
        </div>
        <PatientMessages userDetailsId={userDetailsId} />
      </div>
    </>
  );
}

export default Page;
