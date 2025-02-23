import CreateEncounterDialog from "@/components/charts/CreateEncounterDialog";
import React from "react";
import ViewPatientEncounters from "./ViewPatientEncounters";
import { Heading } from "@/components/ui/heading";

const PatientEncounters = ({ userDetailsId }: { userDetailsId: string }) => {
  return (
    <>
      <div className="flex justify-between items-center">
        <Heading title="Encounters"/>
        <CreateEncounterDialog />
      </div>
      <ViewPatientEncounters userDetailsId={userDetailsId} />
    </>
  );
};

export default PatientEncounters;
