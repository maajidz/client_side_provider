import RecallsDialog from "@/components/charts/Encounters/Details/Recalls/RecallsDialog";
import { PlusIcon } from "lucide-react";
import React, { useState } from "react";
import ViewRecalls from "./ViewRecalls";
import DefaultButton from "@/components/custom_buttons/buttons/DefaultButton";

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
          <div className="flex gap-2">
            <PlusIcon />
            Recalls
          </div>
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
