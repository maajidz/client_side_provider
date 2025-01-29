import { Button } from "@/components/ui/button";
import FamilyHistoryClient from "./client";
import FamilyHistoryDialog from "@/components/charts/Encounters/Details/FamilyHistory/FamilyHistoryDialog";
import { useState } from "react";

interface FamilyHistoryProps {
  userDetailsId: string;
}

function FamilyHistory({ userDetailsId }: FamilyHistoryProps) {
  // Dialog State
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center p-4 text-lg font-semibold rounded-md bg-[#f0f0f0]">
        <span>Family History</span>
        <Button
          variant="ghost"
          className="text-blue-500 hover:text-blue-500 hover:bg-[#f0f0f0]"
          onClick={() => setIsOpen(true)}
        >
          Add
        </Button>
        <FamilyHistoryDialog
          userDetailsId={userDetailsId}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </div>
      <FamilyHistoryClient userDetailsId={userDetailsId} />
    </div>
  );
}

export default FamilyHistory;

