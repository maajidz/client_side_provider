"use client";

import React, { useCallback, useEffect, useState } from "react";
import styles from "./patient.module.css";
import LoadingButton from "../../LoadingButton";
import { PatientDetails } from "@/types/userInterface";
import { fetchUserInfo } from "@/services/userServices";

const PatientDemographics = ({userId}: {userId: string}) => {
  const [response, setResponse] = useState<PatientDetails>();
  const [loading, setLoading] = useState(false);

  const fetchAndSetResponse = useCallback(async () => {
    setLoading(true);
    const userData = await fetchUserInfo({ userDetailsId: userId });
    if (userData) {
      setResponse(userData?.userDetails);
      setLoading(false);
    }
  }, [userId]);

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
    <div className="flex flex-row gap-2">
      <div className={styles.infoBox}>
        <div className="flex flex-col gap-6">
          <div className="font-semibold text-2xl">Basic Information</div>
          <div className="flex flex-col gap-6">
            <div>
              <div className="font-normal text-sm">First Name</div>
              <div className="font-medium text-base">
                {response?.user?.firstName}
              </div>
            </div>
            <div>
              <div className="font-normal text-sm">Last Name</div>
              <div className="font-medium text-base">
                {response?.user?.lastName}
              </div>
            </div>
            <div className="flex flex-col">
              <div className="font-normal text-sm">DOB | Age</div>
              <div className="font-medium text-base">
                {formatDate(response?.dob, {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}{" "}
                | years
              </div>
            </div>
            <div>
              <div className="font-normal text-sm">Birth Sex</div>
              <div className="font-medium text-base">{response?.gender}</div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.infoBox}>
        <div className="flex flex-col gap-6">
          <div className="font-semibold text-2xl">Contact Details</div>
          <div className="flex flex-col gap-6">
            <div>
              <div className="font-normal text-sm">Address</div>
              <div className="font-medium text-base">{response?.location}</div>
            </div>
            <div>
              <div className="font-normal text-sm">Cell Phone</div>
              <div className="font-medium text-base">
                {response?.user?.phoneNumber}
              </div>
            </div>
            <div>
              <div className="font-normal text-sm">Email</div>
              <div className="font-medium text-base">
                {response?.user?.email}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDemographics;
