"use client";

import React, { useCallback, useEffect, useState } from "react";
import styles from "./patient.module.css";
import LoadingButton from "../../../LoadingButton";
import { PatientDetails } from "@/types/userInterface";
import { fetchUserInfo } from "@/services/userServices";
import DefaultButton from "@/components/custom_buttons/buttons/DefaultButton";
import EditPatientBody from "../../add_patient/EditPatientBody";

const PatientDemographics = ({ userDetailsId }: { userDetailsId: string }) => {
  const [response, setResponse] = useState<PatientDetails>();
  const [editPatient, setEditPatient] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const fetchAndSetResponse = useCallback(async () => {
    setLoading(true);
    const userData = await fetchUserInfo({ userDetailsId: userDetailsId });
    if (userData) {
      setResponse(userData?.userDetails);
      setLoading(false);
    }
  }, [userDetailsId]);

  useEffect(() => {
    fetchAndSetResponse();
  }, [fetchAndSetResponse]);

  const formatDate = (
    dateString: string | undefined,
    options?: Intl.DateTimeFormatOptions
  ) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingButton />
      </div>
    );
  }
  return (
    <>
      {response && (
        <div className="flex flex-col gap-2 p-4">
          {editPatient ? (
            <EditPatientBody patientDetails={response} />
          ) : (
            <div className="flex flex-col gap-2 p-4">
              <div className="flex justify-end">
                <DefaultButton
                  onClick={() => {
                    setEditPatient(true);
                  }}
                >
                  Edit Patient
                </DefaultButton>
              </div>
              <div className={styles.infoContainer}>
                <div className={styles.infoBox}>
                  <div className="flex flex-col gap-6">
                    <div className="font-semibold text-2xl">
                      Basic Information
                    </div>
                    <div className="flex flex-col gap-6">
                      <div>
                        <div className={styles.labelText}>First Name</div>
                        <div className={styles.valueText}>
                          {response?.user?.firstName}
                        </div>
                      </div>
                      <div>
                        <div className={styles.labelText}>Last Name</div>
                        <div className={styles.valueText}>
                          {response?.user?.lastName}
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className={styles.labelText}>DOB | Age</div>
                        <div className={styles.valueText}>
                          {formatDate(response?.dob, {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          })}{" "}
                          | years
                        </div>
                      </div>
                      <div>
                        <div className={styles.labelText}>Birth Sex</div>
                        <div className={styles.valueText}>
                          {response?.gender}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.infoBox}>
                  <div className="flex flex-col gap-6">
                    <div className="font-semibold text-2xl">
                      Contact Details
                    </div>
                    <div className="flex flex-col gap-6">
                      <div>
                        <div className={styles.labelText}>Address</div>
                        <div className={styles.valueText}>
                          {response?.location}
                        </div>
                      </div>
                      <div>
                        <div className={styles.labelText}>Cell Phone</div>
                        <div className={styles.valueText}>
                          {response?.user?.phoneNumber}
                        </div>
                      </div>
                      <div>
                        <div className={styles.labelText}>Email</div>
                        <div className={styles.valueText}>
                          {response?.user?.email}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default PatientDemographics;
