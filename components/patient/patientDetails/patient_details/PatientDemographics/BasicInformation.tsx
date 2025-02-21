import React from "react";
import styles from "./patient.module.css";
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
    <div className={styles.infoBox}>
      <div className="flex flex-col gap-4">
        <div className="font-semibold text-xs text-gray-600 uppercase tracking-wider ">Basic Information</div>
        <div className="flex flex-col gap-4">
          <div>
            <div className={styles.labelText}>First Name</div>
            <div className={`${styles.valueText} capitalize`}>
              {patientDetails?.user?.firstName ? patientDetails?.user?.firstName: 'N/A'}
            </div>
          </div>
          <div>
            <div className={styles.labelText}>Last Name</div>
            <div className={`${styles.valueText} capitalize`}>
              {patientDetails?.user?.lastName? patientDetails?.user?.lastName : 'N/A'}
            </div>
          </div>
          <div className="flex flex-col">
            <div className={styles.labelText}>DOB | Age</div>
            <div className={styles.valueText}>
              {formatDate(patientDetails?.dob, {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}{" "}
              | years
            </div>
          </div>
          <div>
            <div className={styles.labelText}>Birth Sex</div>
            <div className={styles.valueText}>{patientDetails?.gender ? patientDetails?.gender : 'N/A'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInformation;
