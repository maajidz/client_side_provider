import GhostButton from "@/components/custom_buttons/GhostButton";
import FamilyHistoryClient from "./client";
import FamilyHistoryDialog from "@/components/charts/Encounters/Details/FamilyHistory/FamilyHistoryDialog";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

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
        <GhostButton label="Add" onClick={() => setIsOpen(true)} />
        <FamilyHistoryDialog
          userDetailsId={userDetailsId}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </div>
      <ScrollArea className="h-[12.5rem] min-h-10">
        <FamilyHistoryClient userDetailsId={userDetailsId} />
      </ScrollArea>
    </div>
  );
}

export default FamilyHistory;
