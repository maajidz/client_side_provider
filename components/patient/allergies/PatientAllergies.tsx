import AllergiesDialog from "@/components/charts/Encounters/Details/Allergies/AllergiesDialog";
import { PlusIcon } from "lucide-react";
import React, { useState } from "react";
import ViewPatientAllergies from "./ViewPatientAllergies";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";

const PatientAllergies = ({ userDetailsId }: { userDetailsId: string }) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between">
        <Heading title="Allergies"/>
        <Button
          onClick={() => {
            setIsDialogOpen(true);
          }}
        >
            <PlusIcon />
            Allergy
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
    </div>
  );
};

export default PatientAllergies;
