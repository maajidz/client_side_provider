import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import AddMedicationBody from "./AddMedicationBody";
import { MedicationList } from "./Medications";

interface AddMedicationDialogProps {
  isOpen: boolean;
  onAddClick: (medication: MedicationList) => void;
}

function AddMedicationDialog({ isOpen, onAddClick }: AddMedicationDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <PlusCircle />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add Medications</DialogTitle>
        </DialogHeader>
        <AddMedicationBody onAddClick={onAddClick} />
      </DialogContent>
    </Dialog>
  );
}

export default AddMedicationDialog;

