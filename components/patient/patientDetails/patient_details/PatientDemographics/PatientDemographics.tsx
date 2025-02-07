"use client";

import React, { useCallback, useEffect, useState } from "react";
import LoadingButton from "../../../../LoadingButton";
import { PatientDetailsInterface } from "@/types/userInterface";
import { fetchUserInfo } from "@/services/userServices";
import DefaultButton from "@/components/custom_buttons/buttons/DefaultButton";
import EditPatientBody from "../../../add_patient/EditPatientBody";
import { ScrollArea } from "@/components/ui/scroll-area";
import styles from "./patient.module.css";
import BasicInformation from "./BasicInformation";
import ContactDetails from "./ContactDetails";
// import PHRRegistration from "./PHRRegistration";
// import PatientId from "./PatientId";
// import EmergencyContact from "./EmergencyContact";
// import PatientPreferences from "./PatientPreferences";
// import AdditionalInformation from "./AdditionalInformation";

const PatientDemographics = ({ userDetailsId }: { userDetailsId: string }) => {
  const [response, setResponse] = useState<PatientDetailsInterface>();
  const [editPatient, setEditPatient] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const fetchAndSetResponse = useCallback(async () => {
    try {
      setLoading(true);
      const userData = await fetchUserInfo({ userDetailsId: userDetailsId });
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
  }, [fetchAndSetResponse]);

  return (
    <>
      {loading && <LoadingButton />}
      {response && (
        <div className="flex flex-col gap-2 p-4">
          {editPatient ? (
            <EditPatientBody patientDetails={response.userDetails} />
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
              {response.userDetails ? (
                <ScrollArea className="h-[calc(80vh-220px)] md:h-[calc(80dvh-200px)]">
                  <div className={styles.infoContainer}>
                    <BasicInformation patientDetails={response.userDetails} />
                    <ContactDetails patientDetails={response.userDetails} />
                    {/* <PHRRegistration patientDetails={response} />
                  <PatientId patientDetails={response} />
                  <EmergencyContact patientDetails={response} />
                  <PatientPreferences patientDetails={response} />
                  <AdditionalInformation patientDetails={response} /> */}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex justify-center items-center">
                  No Data Recorded!
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default PatientDemographics;
