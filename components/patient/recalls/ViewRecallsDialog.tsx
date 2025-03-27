import {
  Dialog,
  DialogContent,
  DialogDescription,
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
          <DialogTitle asChild>View Recalls</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="grid md:grid-cols-2 flex-col items-start gap-6 w-full max-w-md font-medium">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-600">
              Recall Type:
            </span>
            <span>{selectedRecallData?.type}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-600">Notes:</span>
            <span>{selectedRecallData?.notes}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-600">Due Date:</span>
            <span className="capitalize">
              {selectedRecallData?.due_date_period ?? ""}
              {"  "}
              {selectedRecallData?.due_date_value ?? ""}{" "}
              {selectedRecallData?.due_date_unit ?? ""}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-600">Status:</span>
            <span className="capitalize">{selectedRecallData?.status}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-600">Provider:</span>
            <span>{selectedRecallData?.providerId}</span>
          </div>
          {/* <div className="flex flex-col gap-1">
            <span  className="text-sm font-medium text-gray-600">Visit Date:</span>
            <span>[Visit Date]</span>
          </div> */}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ViewRecallDialog;
