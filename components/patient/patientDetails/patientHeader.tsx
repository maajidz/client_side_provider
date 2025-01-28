"use client";
import React, { useEffect, useState } from "react";
import styles from "./patient.module.css";
import { PatientDetails } from "@/types/userInterface";
import { fetchUserInfo } from "@/services/userServices";
import LoadingButton from "../../LoadingButton";
import PatientLabelDetails from "./patientLabelDetails";
import { calculateAge } from "@/utils/utils";

const PatientHeader = ({ userId }: { userId: string }) => {
  const [response, setResponse] = useState<PatientDetails>();
  const [loading, setLoading] = useState(false);
  const [age, setAge] = useState<number>();

  useEffect(() => {
    const fetchAndSetResponse = async () => {
      setLoading(true);
      const userData = await fetchUserInfo({ userDetailsId: userId });
      if (userData) {
        setResponse(userData.userDetails);
        setLoading(false);
        setAge(calculateAge(userData.userDetails.dob))
      }
    };

    fetchAndSetResponse();
  }, [userId, age]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingButton />
      </div>
    );
  }

  return (
    <div className="flex flex-row w-full items-center gap-3 px-3">
      <div className={styles.infoContainer}>
        <div className={styles.infoBox}>
          <PatientLabelDetails
            label="Name:"
            value={`${response?.user?.firstName} ${response?.user?.lastName}`}
          />
          <div className="flex flex-row gap-3">
            <div>{response?.gender}/{age}</div>
            <PatientLabelDetails
              label="ID:"
              value={`${userId.slice(0, 6)}...`}
            />
          </div>
          <PatientLabelDetails
            label="DOB:"
            value={`${response?.dob && response?.dob.split("T")[0]}`}
          />
        </div>
        <div className={styles.infoBox}>
          <div className="flex flex-col gap-3">
            <div>Allergies</div>
            <PatientLabelDetails
              label=""
              value={`${
                response?.allergies && response.allergies.length > 0
                  ? response.allergies
                      .map((allergy) => allergy.Allergen)
                      .join(", ")
                  : "N/A"
              }`}
            />
          </div>
        </div>
        <div className={styles.infoBox}>
          <div>
            <PatientLabelDetails
              label="Weight:"
              value={`${response?.vitals[0].weightLbs}lbs ${response?.vitals[0].weightOzs}ozs`}
            />
            <PatientLabelDetails
              label="Height:"
              value={`${response?.vitals[0]?.heightFeets} fts ${response?.vitals[0]?.heightInches} inches`}
            />
            <PatientLabelDetails
              label="BMI:"
              value={`${response?.vitals[0]?.BMI}`}
            />
          </div>
        </div>
        <div className={styles.infoBox}>
          <PatientLabelDetails label="Wallet:" value={response?.wallet} />
        </div>
      </div>
    </div>
  );
};

export default PatientHeader;
