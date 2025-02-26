"use client";

import React, { useCallback, useEffect, useState } from "react";
import LoadingButton from "../../../../LoadingButton";
import { PatientDetails } from "@/types/userInterface";
import { fetchUserEssentials } from "@/services/userServices";
import BasicInformation from "./BasicInformation";
import ContactDetails from "./ContactDetails";
import EditBasicInformation from "./EditBasicInformation";
import EditContactDetails from "./EditContactDetails";
// import PHRRegistration from "./PHRRegistration";
// import PatientId from "./PatientId";
// import EmergencyContact from "./EmergencyContact";
// import PatientPreferences from "./PatientPreferences";
// import AdditionalInformation from "./AdditionalInformation";

const PatientDemographics = ({ userDetailsId }: { userDetailsId: string }) => {
  const [response, setResponse] = useState<PatientDetails>();
  const [editPatient, setEditPatient] = useState<boolean>(false);
  const [editBasicPatientDetails, setBasicPatientDetails] =
    useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const fetchAndSetResponse = useCallback(async () => {
    try {
      setLoading(true);
      const userData = await fetchUserEssentials({
        userDetailsId: userDetailsId,
      });
      if (userData) {
        setResponse(userData);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [userDetailsId]);

  useEffect(() => {
    fetchAndSetResponse();
  }, [fetchAndSetResponse, editPatient, editBasicPatientDetails]);

  return (
    <>
      {loading && <LoadingButton />}
      {response && (
        <div className="flex flex-col">
          <div className="flex flex-col gap-6">
            <div className="flex flex-1 flex-row gap-4">
              {editBasicPatientDetails ? (
                <EditBasicInformation
                  patientDetails={response}
                  setEditPatient={setBasicPatientDetails}
                />
              ) : (
                <BasicInformation
                  patientDetails={response}
                  setEditPatient={setBasicPatientDetails}
                />
              )}
              {editPatient ? (
                <EditContactDetails
                  patientDetails={response}
                  setEditPatient={setEditPatient}
                />
              ) : (
                <ContactDetails
                  patientDetails={response}
                  setEditPatient={setEditPatient}
                />
              )}
              {/* <PHRRegistration patientDetails={response} />
                  <PatientId patientDetails={response} />
                  <EmergencyContact patientDetails={response} />
                  <PatientPreferences patientDetails={response} />
                  <AdditionalInformation patientDetails={response} /> */}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PatientDemographics;
