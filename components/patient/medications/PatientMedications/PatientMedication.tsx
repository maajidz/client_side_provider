import AddMedicationDialog from "@/components/charts/Encounters/Details/Medications/AddMedicationDialog";
import DefaultButton from "@/components/custom_buttons/buttons/DefaultButton";
import ViewPatientMedications from "./ViewPatientMedications";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

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
        <DefaultButton
          onClick={() => {
            setIsMedicationsDialogOpen(true);
          }}
        >
          <div className="flex items-center gap-2">
            <PlusIcon />
            Medications
          </div>
        </DefaultButton>
        <DefaultButton
          onClick={() => {
            onSetQuickRxVisible(true);
          }}
        >
          <div className="flex items-center gap-2">
            <PlusIcon />
            Prescriptions
          </div>
        </DefaultButton>
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
