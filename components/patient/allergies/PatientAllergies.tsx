import AllergiesDialog from "@/components/charts/Encounters/Details/Allergies/AllergiesDialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import React, { useState } from "react";
import ViewPatientAllergies from "./ViewPatientAllergies";

const PatientAllergies = ({ userDetailsId }: { userDetailsId: string }) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  
  return (
    <>
      <div className="flex justify-end">
        <Button
          className="bg-[#84012A]"
          onClick={() => {
            setIsDialogOpen(true);
          }}
        >
          <div className="flex gap-2">
            <PlusIcon />
            Allergy
          </div>
        </Button>
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
