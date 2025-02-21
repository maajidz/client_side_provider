import { PatientDetails } from "@/types/userInterface";
import React from "react";
import styles from "./patient.module.css";

const ContactDetails = ({
  patientDetails,
}: {
  patientDetails: PatientDetails;
}) => {
  return (
    <div className={styles.infoBox}>
      <div className="flex flex-col gap-6">
        <div className="font-semibold text-xs text-gray-600 uppercase tracking-wider">Contact Details</div>
        <div className="flex flex-col gap-4">
          <div>
            <div className={styles.labelText}>Address</div>
            <div className={styles.valueText}>{patientDetails?.location ? patientDetails?.location: 'N/A'}</div>
          </div>
          <div>
            <div className={styles.labelText}>Cell Phone</div>
            <div className={styles.valueText}>
              {patientDetails?.user?.phoneNumber ? patientDetails?.user?.phoneNumber: 'N/A'}
            </div>
          </div>
          <div>
            <div className={styles.labelText}>Email</div>
            <div className={styles.valueText}>{patientDetails?.user?.email ? patientDetails?.user?.email: 'N/A'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactDetails;
