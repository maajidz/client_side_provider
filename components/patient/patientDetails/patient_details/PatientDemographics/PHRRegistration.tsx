import React from "react";
import styles from "./patient.module.css";
import { PatientDetails } from "@/types/userInterface";

const PHRRegistration = ({
  patientDetails,
}: {
  patientDetails: PatientDetails;
}) => {
  return (
    <div className={styles.infoBox}>
      <div className="flex flex-col gap-6">
        <div className="font-semibold text-2xl">PHR Registration</div>
        <div className="flex flex-col gap-6">
          <div>
            <div className={styles.labelText}>Status</div>
            <div className={styles.valueText}>{patientDetails?.location}</div>
          </div>
          <div>
            <div className={styles.labelText}>Name</div>
            <div className={styles.valueText}>
              {patientDetails?.user?.phoneNumber}
            </div>
          </div>
          <div>
            <div className={styles.labelText}>Email</div>
            <div className={styles.valueText}>
              {patientDetails?.user?.phoneNumber}
            </div>
          </div>
          <div>
            <div className={styles.labelText}>New Portal Status</div>
            <div className={styles.valueText}>
              {patientDetails?.user?.phoneNumber}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PHRRegistration;
