"use client";
import PatientMessages from "@/components/patient/messages/PatientMessages";
import { useParams } from "next/navigation";

// const breadcrumbItems = [
//   { title: "Dashboard", link: "/dashboard" },
//   { title: "Patients", link: "/dashboard/provider/patient" },
//   { title: "Messages", link: "" },
// ];
function Page() {
  const { userDetailsId } = useParams();

  if (!userDetailsId || Array.isArray(userDetailsId)) {
    return <div>Error: User details ID not found</div>;
  }
  return (
    <>
      <div className="flex w-full flex-col gap-6 rounded-xl border border-gray-300/50 p-4 bg-white shadow-sm">
        {/* <div className="flex flex-1 gap-4 flex-col"> */}
          {/* <Breadcrumbs items={breadcrumbItems} /> */}
          {/* <Heading title="Messages" description="" /> */}
        {/* </div> */}
        <PatientMessages userDetailsId={userDetailsId} />
      </div>
    </>
  );
}

export default Page;
