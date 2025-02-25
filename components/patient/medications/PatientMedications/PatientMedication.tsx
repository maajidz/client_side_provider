import AddMedicationDialog from "@/components/charts/Encounters/Details/Medications/AddMedicationDialog";
import ViewPatientMedications from "./ViewPatientMedications";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const PatientMedication = ({
  userDetailsId,
  onSetQuickRxVisible,
}: {
  userDetailsId: string;
  onSetQuickRxVisible: (visible: boolean) => void;
}) => {
  // Dialog State
  const [isMedicationsDialogOpen, setIsMedicationsDialogOpen] = useState(false);

  return (
    <>
      <div className="flex gap-5 justify-end">
        <Button
        variant={"secondary"}
          onClick={() => {
            setIsMedicationsDialogOpen(true);
          }}
        >
            <PlusIcon />
            Medications
        </Button>
        <Button
          onClick={() => {
            onSetQuickRxVisible(true);
          }}
        >
            <PlusIcon />
            Prescriptions
        </Button>
        <AddMedicationDialog
          userDetailsId={userDetailsId}
          onClose={() => {
            setIsMedicationsDialogOpen(false);
          }}
          isOpen={isMedicationsDialogOpen}
        />
      </div>

      {/* Patient Medications Table */}
      <ViewPatientMedications userDetailsId={userDetailsId} />
    </>
  );
};

export default PatientMedication;
