import RecallsDialog from "@/components/charts/Encounters/Details/Recalls/RecallsDialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import React, { useState } from "react";
import ViewRecalls from "./ViewRecalls";

const PatientRecalls = ({ userDetailsId }: { userDetailsId: string }) => {
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
            Recalls
          </div>
        </Button>
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
