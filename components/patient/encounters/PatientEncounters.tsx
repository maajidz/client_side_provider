import CreateEncounterDialog from "@/components/charts/CreateEncounterDialog";
import React, { useState } from "react";
import ViewPatientEncounters from "./ViewPatientEncounters";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";

const PatientEncounters = ({ userDetailsId }: { userDetailsId: string }) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  return (
    <>
      <div className="flex justify-between items-center">
        <Heading title="Encounters" />
        <Button
          onClick={() => {
            setIsDialogOpen(true);
          }}
        >
          Add 1234
        </Button>
        <CreateEncounterDialog
          isDialogOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
          }}
        />
      </div>
      <ViewPatientEncounters userDetailsId={userDetailsId} />
    </>
  );
};

export default PatientEncounters;
