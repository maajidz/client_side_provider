"use client";

import React, { useCallback, useEffect, useState } from "react";
import LoadingButton from "../../../../LoadingButton";
import { PatientDetails } from "@/types/userInterface";
import { fetchUserEssentials } from "@/services/userServices";
import DefaultButton from "@/components/custom_buttons/buttons/DefaultButton";
import EditPatientBody from "../../../add_patient/EditPatientBody";
import { ScrollArea } from "@/components/ui/scroll-area";
import styles from "./patient.module.css";
import BasicInformation from "./BasicInformation";
import ContactDetails from "./ContactDetails";
import { Button } from "@/components/ui/button";
// import PHRRegistration from "./PHRRegistration";
// import PatientId from "./PatientId";
// import EmergencyContact from "./EmergencyContact";
// import PatientPreferences from "./PatientPreferences";
// import AdditionalInformation from "./AdditionalInformation";

const PatientDemographics = ({ userDetailsId }: { userDetailsId: string }) => {
  const [response, setResponse] = useState<PatientDetails>();
  const [editPatient, setEditPatient] = useState<boolean>(false);
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
  }, [fetchAndSetResponse]);

  return (
    <>
      {loading && <LoadingButton />}
      {response && (
        <div className="flex flex-col gap-2">
          {editPatient ? (
            <EditPatientBody patientDetails={response} />
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex justify-end">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setEditPatient(true);
                  }}
                >
                  Edit Patient
                </Button>
              </div>
              <ScrollArea className="h-[calc(80vh-220px)] md:h-[calc(80dvh-200px)]">
                <div className={styles.infoContainer}>
                  <BasicInformation patientDetails={response} />
                  <ContactDetails patientDetails={response} />
                  {/* <PHRRegistration patientDetails={response} />
                  <PatientId patientDetails={response} />
                  <EmergencyContact patientDetails={response} />
                  <PatientPreferences patientDetails={response} />
                  <AdditionalInformation patientDetails={response} /> */}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default PatientDemographics;
