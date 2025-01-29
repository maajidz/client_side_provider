import PastMedicalHistoryDialog from "@/components/charts/Encounters/Details/PastMedicalHistory/PastMedicalHistoryDialog";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import PastMedicalHistoryClient from "./client";

interface PastMedicalHistoryProps {
  userDetailsId: string;
}

function PastMedicalHistory({ userDetailsId }: PastMedicalHistoryProps) {
  // Dialog State
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center p-4 text-lg font-semibold rounded-md bg-[#f0f0f0]">
        <span>Past Medical History</span>
        <Button
          variant="ghost"
          className="text-blue-500 hover:text-blue-500 hover:bg-[#f0f0f0]"
          onClick={() => setIsOpen(true)}
        >
          Add
        </Button>
        <PastMedicalHistoryDialog
          userDetailsId={userDetailsId}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </div>
      <PastMedicalHistoryClient userDetailsId={userDetailsId} />
    </div>
  );
}

export default PastMedicalHistory;
