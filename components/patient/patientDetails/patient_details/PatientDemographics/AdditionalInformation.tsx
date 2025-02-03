import React from "react";
import styles from "./patient.module.css";
import { PatientDetails } from "@/types/userInterface";

const AdditionalInformation = ({
  patientDetails,
}: {
  patientDetails: PatientDetails;
}) => {
  return (
    <div className={styles.infoBox}>
      <div className="flex flex-col gap-6">
        <div className="font-semibold text-2xl">Additional Information</div>
        <div className="flex flex-col gap-6">
          <div>
            <div className={styles.labelText}>Category</div>
            <div className={styles.valueText}>
              {patientDetails?.user?.firstName}
            </div>
          </div>
          <div>
            <div className={styles.labelText}>Blood Group</div>
            <div className={styles.valueText}>
              {patientDetails?.user?.lastName}
            </div>
          </div>
          <div>
            <div className={styles.labelText}>Language</div>
            <div className={styles.valueText}>{patientDetails?.gender}</div>
          </div>
          <div>
            <div className={styles.labelText}>ISO 639-1 alpha 2 code</div>
            <div className={styles.valueText}>{patientDetails?.gender}</div>
          </div>
          <div>
            <div className={styles.labelText}>Race</div>
            <div className={styles.valueText}>{patientDetails?.gender}</div>
          </div>
          <div>
            <div className={styles.labelText}>Ethnicity</div>
            <div className={styles.valueText}>{patientDetails?.gender}</div>
          </div>
          <div>
            <div className={styles.labelText}>Smoking Status</div>
            <div className={styles.valueText}>{patientDetails?.gender}</div>
          </div>
          <div>
            <div className={styles.labelText}>Marital Status</div>
            <div className={styles.valueText}>{patientDetails?.gender}</div>
          </div>
          <div>
            <div className={styles.labelText}>Employment Status</div>
            <div className={styles.valueText}>{patientDetails?.gender}</div>
          </div>
          <div>
            <div className={styles.labelText}>Sexual Orientation</div>
            <div className={styles.valueText}>{patientDetails?.gender}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdditionalInformation;
