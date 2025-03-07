"use client";

import React, { useCallback, useEffect, useState } from "react";
import LoadingButton from "../../../../LoadingButton";
import { PatientDetails } from "@/types/userInterface";
import { fetchUserEssentials } from "@/services/userServices";
import BasicInformation from "./BasicInformation";
import ContactDetails from "./ContactDetails";
import EditBasicInformation from "./EditBasicInformation";
import EditContactDetails from "./EditContactDetails";

const PatientDemographics = ({ userDetailsId }: { userDetailsId: string }) => {
  const [response, setResponse] = useState<PatientDetails>();
  const [editPatient, setEditPatient] = useState<boolean>(false);
  const [editBasicPatientDetails, setBasicPatientDetails] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAndSetResponse = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const userData = await fetchUserEssentials({
        userDetailsId: userDetailsId,
      });
      if (userData) {
        setResponse(userData);
      }
    } catch (error) {
      console.log(error);
      setError("Failed to load patient details.");
    } finally {
      setLoading(false);
    }
  }, [userDetailsId]);

  useEffect(() => {
    fetchAndSetResponse();
  }, [fetchAndSetResponse]);

  const renderBasicInformation = () =>
    editBasicPatientDetails ? (
      <EditBasicInformation
        patientDetails={response!}
        setEditPatient={setBasicPatientDetails}
      />
    ) : (
      <BasicInformation
        patientDetails={response!}
        setEditPatient={setBasicPatientDetails}
      />
    );

  const renderContactDetails = () =>
    editPatient ? (
      <EditContactDetails
        patientDetails={response!}
        setEditPatient={setEditPatient}
      />
    ) : (
      <ContactDetails
        patientDetails={response!}
        setEditPatient={setEditPatient}
      />
    );

  if (loading) return <LoadingButton />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      {loading ? (
        <LoadingButton />
      ) : response ? (
        <div className="flex flex-col">
          <div className="flex flex-col gap-6">
            <div className="flex flex-1 flex-row gap-4">
              {renderBasicInformation()}
              {renderContactDetails()}
              {/* <PHRRegistration patientDetails={response} />
                  <PatientId patientDetails={response} />
                  <EmergencyContact patientDetails={response} />
                  <PatientPreferences patientDetails={response} />
                  <AdditionalInformation patientDetails={response} /> */}
            </div>
          </div>
        </div>
      ) : (
        <p>No data available.</p>
      )}
    </>
  );
};

export default PatientDemographics;
