"use client";
import React, { useCallback, useEffect, useState } from "react";
import { PatientDetails } from "@/types/userInterface";
import { fetchUserEssentials } from "@/services/userServices";
import { setUserId } from "@/store/slices/userSlice";
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

  const fetchAndSetResponse = useCallback(async () => {
    setLoading(true);
    try {
      const userData = await fetchUserEssentials({ userDetailsId: userId });
      if (userData) {
        setResponse(userData);
        setLoading(false);
        setAge(calculateAge(userData.dob));

        const encounter = userData.encounter.pop();

        let latestChartId = "";
        if (encounter) {
          latestChartId = encounter.chart?.id || "";
        }

        dispatch(
          setUserId({
            chartId: latestChartId,
            email: userData.user.email ?? "",
            firstName: userData.user.firstName ?? "",
            lastName: userData.user.lastName ?? "",
            phoneNumber: userData.user.phoneNumber ?? ""
          })
        );
      }
    } catch (error) {
      console.log("Error", error);
    } finally {
      setLoading(false);
    }
  }, [userId, dispatch]);

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
      <div className={styles.infoContainer}>
        <div className={`${styles.infoBox} bg-[#EDF9F3] capitalize`}>
          {response &&
          response.user &&
          (response.user.firstName || response.user.lastName)
            ? `${response?.user?.firstName} ${response?.user?.lastName}`
            : "N/A"}
          <div className="flex flex-row gap-3 items-center">
            <div>
              {response && (response.gender || age)
                ? `${response?.gender}/${age}`
                : "N/A"}
            </div>
            <PatientLabelDetails
              label="ID:"
              value={response?.patientId ? response.patientId : "N/A"}
            />
          </div>
        </div>
        <div className={`${styles.infoBox}  bg-[#ECF5FF]`}>
          <div className="flex  items-center gap-3">
            <div className={styles.labelText}>Allergies:</div>
            {response && response.allergies
              ? response.allergies.map((allergy, index) => (
                  <div
                    className={`${styles.valueText} text-[#fb6e52]`}
                    key={allergy.id}
                  >
                    {index === 0 ? "" : ","}
                    {allergy.Allergen}
                  </div>
                ))
              : "N/A"}
          </div>
        </div>
        <div className={`${styles.infoBox}  bg-[#FFFFEA]`}>
          <div className="flex flex-col gap-3">
            <div className="flex flex-row gap-5">
              <PatientLabelDetails
                label="Weight:"
                value={
                  response && response.vitals
                    ? `${response?.vitals[response.vitals.length - 1]?.weightLbs}lbs ${response?.vitals[0]?.weightOzs}ozs`
                    : "N/A"
                }
              />
              <PatientLabelDetails
                label="BMI:"
                value={
                  response && response.vitals[0].BMI
                    ? `${response?.vitals[0]?.BMI}`
                    : "N/A"
                }
              />
            </div>
            {/* <PatientLabelDetails
              label="Height:"
              value={`${response?.vitals[0]?.heightFeets} fts ${response?.vitals[0]?.heightInches} inches`}
            /> */}
          </div>
        </div>
        <div className={`${styles.infoBox}  bg-[#FFF2FF]`}>
          <PatientLabelDetails
            label="Wallet:"
            value={response && response?.wallet ? response.wallet : "N/A"}
          />
        </div>
      </div>
    </div>
  );
};

export default PatientHeader;
