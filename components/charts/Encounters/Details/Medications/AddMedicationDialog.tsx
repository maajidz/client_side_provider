import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserEncounterData } from "@/types/chartsInterface";
import { PlusCircle } from "lucide-react";
import AddMedicationBody from "./AddMedicationBody";

interface AddMedicationDialogProps {
  patientDetails: UserEncounterData;
}

function AddMedicationDialog({ patientDetails }: AddMedicationDialogProps) {
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
        <AddMedicationBody patientDetails={patientDetails} />
      </DialogContent>
    </Dialog>
  );
}

export default AddMedicationDialog;
