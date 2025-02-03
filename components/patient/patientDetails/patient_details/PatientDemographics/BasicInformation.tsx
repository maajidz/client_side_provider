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
      <div className="flex flex-col gap-6">
        <div className="font-semibold text-2xl">Basic Information</div>
        <div className="flex flex-col gap-6">
          <div>
            <div className={styles.labelText}>First Name</div>
            <div className={styles.valueText}>
              {patientDetails?.user?.firstName}
            </div>
          </div>
          <div>
            <div className={styles.labelText}>Last Name</div>
            <div className={styles.valueText}>
              {patientDetails?.user?.lastName}
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
            <div className={styles.valueText}>{patientDetails?.gender}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInformation;
