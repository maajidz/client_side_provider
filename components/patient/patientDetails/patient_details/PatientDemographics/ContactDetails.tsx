import { PatientDetails } from "@/types/userInterface";
import React from "react";
import styles from "./patient.module.css";

const ContactDetails = ({
  patientDetails,
}: {
  patientDetails: PatientDetails;
}) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg flex-1">
      <div className="flex flex-col gap-4">
        <div className="font-semibold text-xs pb-2 text-gray-600 uppercase tracking-wider ">Contact Details</div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <div className="text-xs font-medium text-gray-500 gap-1">Address</div>
            <div className="font-medium capitalize">{patientDetails?.location ? patientDetails?.location: 'N/A'}</div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-xs font-medium text-gray-500 gap-1">Cell Phone</div>
            <div className="font-medium capitalize">
              {patientDetails?.user?.phoneNumber ? patientDetails?.user?.phoneNumber: 'N/A'}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-xs font-medium text-gray-500 gap-1">Email</div>
            <div className="font-medium capitalize">{patientDetails?.user?.email ? patientDetails?.user?.email: 'N/A'}</div>
          </div>
        </div>
        </div>
    </div>
  );
};

export default ContactDetails;
