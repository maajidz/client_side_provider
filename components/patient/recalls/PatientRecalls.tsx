import DefaultButton from "@/components/custom_buttons/buttons/DefaultButton";
import RecallsDialog from "@/components/charts/Encounters/Details/Recalls/RecallsDialog";
import ViewRecalls from "./ViewRecalls";
import { PlusIcon } from "lucide-react";
import React, { useState } from "react";

const PatientRecalls = ({ userDetailsId }: { userDetailsId: string }) => {
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
            Recalls
        </DefaultButton>
        <RecallsDialog
          userDetailsId={userDetailsId}
          onClose={() => {
            setIsDialogOpen(false);
          }}
          isOpen={isDialogOpen}
        />
      </div>
      <ViewRecalls userDetailsId={userDetailsId} />
    </>
  );
};

export default PatientRecalls;
