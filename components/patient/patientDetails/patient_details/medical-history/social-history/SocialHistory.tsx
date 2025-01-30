import SocialHistoryDialog from "@/components/charts/Encounters/Details/SocialHistory/SocialHistoryDialog";
import { Button } from "@/components/ui/button";
import SocialHistoryData from "./SocialHistoryData";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SocialHistoryProps {
  userDetailsId: string;
}

function SocialHistory({ userDetailsId }: SocialHistoryProps) {
  // Dialog State
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center p-4 text-lg font-semibold rounded-md bg-[#f0f0f0]">
        <span>Social History</span>
        <Button
          variant="ghost"
          className="text-blue-500 hover:text-blue-500 hover:bg-[#f0f0f0]"
          onClick={() => setIsOpen(true)}
        >
          Add
        </Button>
        <SocialHistoryDialog
          userDetailsId={userDetailsId}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </div>
      <ScrollArea className="h-[12.5rem] min-h-10">
        <SocialHistoryData userDetailsId={userDetailsId} />
      </ScrollArea>
    </div>
  );
}

export default SocialHistory;
