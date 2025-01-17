import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import React, { useState } from "react";
import QuickNotesDialog from "./QuickNotesDialog";
import ViewPatientQuickNotes from "./ViewPatientQuickNotes";

const PatientQuickNotes = ({ userDetailsId }: { userDetailsId: string }) => {
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
            Note
          </div>
        </Button>
        <QuickNotesDialog
          userDetailsId={userDetailsId}
          onClose={() => {
            setIsDialogOpen(false);
          }}
          isOpen={isDialogOpen}
        />
      </div>
      <ViewPatientQuickNotes userDetailsId={userDetailsId} />
    </>
  );
};

export default PatientQuickNotes;
