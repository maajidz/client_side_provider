import CreateEncounterDialog from "@/components/charts/CreateEncounterDialog";
import React from "react";
import ViewPatientEncounters from "./ViewPatientEncounters";

const PatientEncounters = ({ userDetailsId }: { userDetailsId: string }) => {
  return (
    <>
      <div className="flex justify-end">
        <CreateEncounterDialog />
      </div>
      <ViewPatientEncounters userDetailsId={userDetailsId} />
    </>
  );
};

export default PatientEncounters;
