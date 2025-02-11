import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RecallsEditData } from "@/types/recallsInterface";
import { Dispatch, SetStateAction } from "react";

interface ViewRecallDialogProps {
  isOpen: boolean;
  userDetailsId: string;
  selectedRecallData: RecallsEditData | null;
  onSetIsDialogOpen: Dispatch<
    SetStateAction<{ create: boolean; edit: boolean; view: boolean }>
  >;
}

function ViewRecallDialog({
  isOpen,
  selectedRecallData,
  onSetIsDialogOpen,
}: ViewRecallDialogProps) {
  const handleDialogIsOpen = (status: boolean) => {
    onSetIsDialogOpen((prev) => ({ ...prev, view: status }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>View Recalls</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-start gap-3 p-4 w-full max-w-md">
          <div className="flex justify-between w-full text-center">
            <span>Recall Type:</span>
            <span>{selectedRecallData?.type}</span>
          </div>
          <div className="flex justify-between w-full text-center">
            <span>Notes:</span>
            <span>{selectedRecallData?.notes}</span>
          </div>
          <div className="flex justify-between w-full text-center">
            <span>Due Date:</span>
            <span>
              {selectedRecallData?.due_date_period ?? ""}{" "}
              {selectedRecallData?.due_date_value ?? ""}{" "}
              {selectedRecallData?.due_date_unit ?? ""}
            </span>
          </div>
          <div className="flex justify-between w-full text-center">
            <span>Provider:</span>
            <span>[Provider Name]</span>
          </div>
          <div className="flex justify-between w-full text-center">
            <span>Status:</span>
            <span>[Status]</span>
          </div>
          <div className="flex justify-between w-full text-center">
            <span>Visit Date:</span>
            <span>[Visit Date]</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ViewRecallDialog;
