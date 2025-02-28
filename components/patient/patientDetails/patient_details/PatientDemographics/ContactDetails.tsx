import { Button } from "@/components/ui/button";
import { PatientDetails } from "@/types/userInterface";
import { Pencil } from "lucide-react";
import React from "react";

const ContactDetails = ({
  patientDetails,
  setEditPatient,
}: {
  patientDetails: PatientDetails;
  setEditPatient: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className="flex border-gray-100 border group p-6 py-4 flex-1 rounded-lg">
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-row justify-between items-center">
          <div className="font-semibold text-xs text-gray-600">
            Contact Details
          </div>
          <Button
            onClick={() => {
              setEditPatient(true);
            }}
            variant="greyghost"
            className="invisible group-hover:visible"
          >
            <Pencil />
            Edit
          </Button>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <div className="text-xs font-medium text-gray-500 gap-1">
              Address
            </div>
            <div className="font-semibold capitalize text-sm">
              {patientDetails?.location ? patientDetails?.location : "N/A"}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-xs font-medium text-gray-500 gap-1">
              Cell Phone
            </div>
            <div className="font-semibold capitalize text-sm">
              {patientDetails?.user?.phoneNumber
                ? patientDetails?.user?.phoneNumber
                : "N/A"}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-xs font-medium text-gray-500 gap-1">Email</div>
            <div className="font-semibold capitalize text-sm">
              {patientDetails?.user?.email
                ? patientDetails?.user?.email
                : "N/A"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactDetails;
