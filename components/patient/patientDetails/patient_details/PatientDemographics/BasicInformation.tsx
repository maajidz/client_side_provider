import React from "react";
import { PatientDetails } from "@/types/userInterface";

const BasicInformation = ({
  patientDetails,
}: {
  patientDetails: PatientDetails;
}) => {
    
  const formatDate = (
    dateString: string | undefined,
    options?: Intl.DateTimeFormatOptions
  ) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg flex-1">
      <div className="flex flex-col gap-4">
        <div className="font-semibold text-xs pb-2 text-gray-600 uppercase tracking-wider ">Basic Information</div>
        <div className="flex flex-col gap-6">
          <div className="flex gap-1 flex-col">
            <div className="text-xs font-medium text-gray-500 gap-1">First Name</div>
            <div className={"font-medium capitalize"}>
              {patientDetails?.user?.firstName ? patientDetails?.user?.firstName: 'N/A'}
            </div>
          </div>
          <div className="flex gap-1 flex-col">
            <div className="text-xs font-medium text-gray-500 gap-1">Last Name</div>
            <div className="font-medium capitalize">
              {patientDetails?.user?.lastName? patientDetails?.user?.lastName : 'N/A'}
            </div>
          </div>
          <div className="flex gap-1 flex-col">
            <div className="text-xs font-medium text-gray-500 gap-1">DOB | Age</div>
            <div className="font-medium capitalize">
              {formatDate(patientDetails?.dob, {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}{" "}
              | years
            </div>
          </div>
          <div className="flex gap-1 flex-col">
            <div className="text-xs font-medium text-gray-500">Birth Sex</div>
            <div className="font-medium capitalize">{patientDetails?.gender ? patientDetails?.gender : 'N/A'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInformation;
