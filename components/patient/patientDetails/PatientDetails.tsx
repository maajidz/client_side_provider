"use client";
import { UserInfo } from "@/types/userInterface";
import { fetchUserInfo } from "@/services/userServices";
import React, { useEffect, useState } from "react";
import LoadingButton from "../../LoadingButton";
import styles from "./patient.module.css";

const PatientDetails = ({ userId }: { userId: string }) => {
  const [response, setResponse] = useState<UserInfo>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
      const fetchAndSetResponse = async () => {
          setLoading(true)
          const userData = await fetchUserInfo({ userId: userId });
          if (userData) {
              setResponse(userData);
              setLoading(false);
          }
      };

      fetchAndSetResponse();
  }, [userId]);

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
                response?.data.firstName
              </div>
            </div>
            <div>
              <div className="font-normal text-sm">Last Name</div>
              <div className="font-medium text-base">
                response?.data.lastName
              </div>
            </div>
            <div className="flex flex-col">
              <div className="font-normal text-sm">DOB | Age</div>
              <div className="font-medium text-base">
                {formatDate(response?.data.userDetails.dob, {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}{" "}
                | years
              </div>
            </div>
            <div>
              <div className="font-normal text-sm">Birth Sex</div>
              <div className="font-medium text-base">
                response?.data.userDetails.gender
              </div>
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
              <div className="font-medium text-base">
                {response?.data.userDetails.location}
              </div>
            </div>
            <div>
              <div className="font-normal text-sm">Cell Phone</div>
              <div className="font-medium text-base">
                {response?.data.phoneNumber}
              </div>
            </div>
            <div>
              <div className="font-normal text-sm">Email</div>
              <div className="font-medium text-base">
                {response?.data.email}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;
