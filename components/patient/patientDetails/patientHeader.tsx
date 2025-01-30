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
        setAge(calculateAge(userData.userDetails.dob));
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
    <div className="flex flex-row w-full items-center">
      {response && (
        <div className={styles.infoContainer}>
          <div className={`${styles.infoBox}   bg-[#EDF9F3]`}>
            {`${response?.user?.firstName} ${response?.user?.lastName}`}
            <div className="flex flex-row gap-3 items-center">
              <div>
                {response?.gender}/{age}
              </div>
              <PatientLabelDetails
                label="ID:"
                value={`${userId.slice(0, 15)}...`}
              />
            </div>
          </div>
          <div className={`${styles.infoBox}  bg-[#ECF5FF]`}>
            <PatientLabelDetails
              label="Allergies:"
              value={`${
                response?.allergies && response.allergies.length > 0
                  ? response.allergies
                      .map((allergy) => allergy.Allergen)
                      .join(", ")
                  : "N/A"
              }`}
            />
          </div>
          <div className={`${styles.infoBox}  bg-[#FFFFEA]`}>
            <div className="flex flex-col gap-3">
              <div className="flex flex-row gap-5">
                <PatientLabelDetails
                  label="Weight:"
                  value={`${response?.vitals[0].weightLbs}lbs ${response?.vitals[0].weightOzs}ozs`}
                />
                <PatientLabelDetails
                  label="BMI:"
                  value={`${response?.vitals[0]?.BMI}`}
                />
              </div>
              {/* <PatientLabelDetails
              label="Height:"
              value={`${response?.vitals[0]?.heightFeets} fts ${response?.vitals[0]?.heightInches} inches`}
            /> */}
            </div>
          </div>
          <div className={`${styles.infoBox}  bg-[#FFF2FF]`}>
            <PatientLabelDetails label="Wallet:" value={response?.wallet} />
          </div>
        </div>
      ) }
    </div>
  );
};

export default PatientHeader;
