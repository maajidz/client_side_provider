import { PatientMedicationsClient } from "@/components/tables/patient/patientMedications/client";
import React from "react";

const PatientMedications = ({ userDetailsId }: { userDetailsId: string }) => {
  return (
    <>
      <div>PatientMedications {userDetailsId}</div>
      <PatientMedicationsClient userDetailsId={userDetailsId} />
    </>
  );
};

export default PatientMedications;
