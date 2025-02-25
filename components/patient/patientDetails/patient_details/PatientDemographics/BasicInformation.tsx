import React from "react";
import { PatientDetails } from "@/types/userInterface";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

const BasicInformation = ({
  patientDetails,
}: {
  patientDetails: PatientDetails;
}) => {
  
  // const [editPatient, setEditPatient] = useState<boolean>(false);
  const formatDate = (
    dateString: string | undefined,
    options?: Intl.DateTimeFormatOptions
  ) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  };

  return (
    
    <div className="border-gray-100 border p-6 py-4 group flex-1 rounded-lg">
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-row justify-between items-center">
        <div className="font-semibold text-xs text-gray-600">Basic Information</div>
        <Button
            variant="greyghost"
            className="invisible group-hover:visible"
            onClick={() => {
              // setEditPatient(true);
            }}
          >
            <Pencil/>
            Edit
        </Button>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex gap-1 flex-col">
            <div className="text-xs font-medium text-gray-500 gap-1">First Name</div>
            <div className={"font-semibold capitalize text-sm"}>
              {patientDetails?.user?.firstName ? patientDetails?.user?.firstName: 'N/A'}
            </div>
          </div>
          <div className="flex gap-1 flex-col">
            <div className="text-xs font-medium text-gray-500 gap-1">Last Name</div>
            <div className="font-semibold capitalize text-sm">
              {patientDetails?.user?.lastName? patientDetails?.user?.lastName : 'N/A'}
            </div>
          </div>
          <div className="flex gap-1 flex-col">
            <div className="text-xs font-medium text-gray-500 gap-1">DOB | Age</div>
            <div className="font-semibold capitalize text-sm">
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
            <div className="font-semibold capitalize text-sm">{patientDetails?.gender ? patientDetails?.gender : 'N/A'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInformation;
