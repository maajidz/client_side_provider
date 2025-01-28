import AllergiesDialog from "@/components/charts/Encounters/Details/Allergies/AllergiesDialog";
import { PlusIcon } from "lucide-react";
import React, { useState } from "react";
import ViewPatientAllergies from "./ViewPatientAllergies";
import DefaultButton from "@/components/custom_buttons/buttons/DefaultButton";

const PatientAllergies = ({ userDetailsId }: { userDetailsId: string }) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  
  return (
    <>
      <div className="flex justify-end">
        <DefaultButton
          onClick={() => {
            setIsDialogOpen(true);
          }}
        >
          <div className="flex gap-2">
            <PlusIcon />
            Alerts
          </div>
        </DefaultButton>
        <AllergiesDialog
          userDetailsId={userDetailsId}
          onClose={() => {
            setIsDialogOpen(false);
          }}
          isOpen={isDialogOpen}
        />
      </div>
      <ViewPatientAllergies userDetailsId={userDetailsId} />
    </>
  );
};

export default PatientAllergies;
