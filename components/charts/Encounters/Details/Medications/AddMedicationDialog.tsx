import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AddMedicationBody from "./AddMedicationBody";

interface AddMedicationDialogProps {
  userDetailsId: string;
  onClose: () => void;
  isOpen: boolean;
}

function AddMedicationDialog({ userDetailsId, onClose, isOpen }: AddMedicationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add Medications</DialogTitle>
        </DialogHeader>
        <AddMedicationBody userDetailsId={userDetailsId} />
      </DialogContent>
    </Dialog>
  );
}

export default AddMedicationDialog;
