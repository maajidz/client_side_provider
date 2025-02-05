import SupplementsDialog from "@/components/charts/Encounters/Details/Supplements/SupplementsDialog";
import { PlusIcon } from "lucide-react";
import React, { useState } from "react";
import ViewPatientSupplements from "./ViewPatientSupplements";
import DefaultButton from "@/components/custom_buttons/buttons/DefaultButton";

const PatientSupplements = ({ userDetailsId }: { userDetailsId: string }) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  return (
    <>
      <div className="flex justify-end">
        <DefaultButton
          onClick={() => {
            setIsDialogOpen(true);
          }}
        >
            <PlusIcon />
            Supplements
        </DefaultButton>
        <SupplementsDialog
          userDetailsId={userDetailsId}
          onClose={() => {
            setIsDialogOpen(false);
          }}
          isOpen={isDialogOpen}
        />
      </div>
      <ViewPatientSupplements userDetailsId={userDetailsId} />
    </>
  );
};

export default PatientSupplements;
