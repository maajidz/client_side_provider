import React from "react";
import ViewPatientEncounters from "./ViewPatientEncounters";

const PatientEncounters = ({ userDetailsId }: { userDetailsId: string }) => {
  return <ViewPatientEncounters userDetailsId={userDetailsId} />;
};

export default PatientEncounters;
