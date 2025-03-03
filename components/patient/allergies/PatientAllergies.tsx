import React from "react";
import ViewPatientAllergies from "./ViewPatientAllergies";

const PatientAllergies = ({ userDetailsId }: { userDetailsId: string }) => {
  return <ViewPatientAllergies userDetailsId={userDetailsId} />;
};

export default PatientAllergies;
