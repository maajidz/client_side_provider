"use client";
import React, { useCallback, useEffect, useState } from "react";
import { PatientDetails } from "@/types/userInterface";
import { fetchUserInfo } from "@/services/userServices";
import { setChartId } from "@/store/slices/userSlice";
import { calculateAge } from "@/utils/utils";
import styles from "./patient.module.css";
import LoadingButton from "../../LoadingButton";
import PatientLabelDetails from "./patientLabelDetails";
import { useDispatch } from "react-redux";

const PatientHeader = ({ userId }: { userId: string }) => {
  const [response, setResponse] = useState<PatientDetails>();
  const [loading, setLoading] = useState(false);
  const [age, setAge] = useState<number>();

  const dispatch = useDispatch();

  const fetchAndSetResponse = useCallback(() => {
    async () => {
      setLoading(true);
      const userData = await fetchUserInfo({ userDetailsId: userId });
      if (userData) {
        setResponse(userData.userDetails);
        setLoading(false);
        setAge(calculateAge(userData.userDetails.dob));

        const encounter = userData.userDetails.encounter.pop();

        let latestChartId = "";
        if (encounter) {
          latestChartId = encounter.chart?.id || "";
        }

        dispatch(
          setChartId({
            chartId: latestChartId,
          })
        );
      }
    };
  }, [userId, age]);

  useEffect(() => {
    fetchAndSetResponse();
  }, [fetchAndSetResponse]);

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
          <div className={`${styles.infoBox} bg-[#EDF9F3]`}>
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
            <div className="flex  items-center gap-3">
              <div className={styles.labelText}>Allergies:</div>
              {response.allergies.map((allergy, index) => (
                <div
                  className={`${styles.valueText} text-[#fb6e52]`}
                  key={allergy.id}
                >
                  {index === 0 ? "" : ","}
                  {allergy.Allergen}
                </div>
              ))}
            </div>
          </div>
          <div className={`${styles.infoBox}  bg-[#FFFFEA]`}>
            <div className="flex flex-col gap-3">
              <div className="flex flex-row gap-5">
                <PatientLabelDetails
                  label="Weight:"
                  value={`${response?.vitals[0]?.weightLbs}lbs ${response?.vitals[0]?.weightOzs}ozs`}
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
      )}
    </div>
  );
};

export default PatientHeader;
