import GhostButton from "@/components/custom_buttons/buttons/GhostButton";
import { Separator } from "@/components/ui/separator";
import AllergiesAndMedications from "./AllergiesAndMedications";
import PastPrescriptionsDialog from "./PastPrescriptionsDialog";
import PatientMedicationDialog from "./PatientMedicationDialog";
import { useState } from "react";

interface QuickRxProps {
  userDetailsId: string;
}

function QuickRx({ userDetailsId }: QuickRxProps) {
  // Prescription Dialog State
  const [isPrescriptionsDialogOpen, setIsPrescriptionsDialogOpen] =
    useState(false);

  // Past Prescription Dialog State

  const [isPastPrescriptionsDialogOpen, setIsPastPrescriptionsDialogOpen] =
    useState(false);

  return (
    <div className="flex flex-col justify-end">
      <div className="flex border-b pb-3">
        <div className="flex flex-row-reverse items-center gap-2 w-full bg-[#f4f4f5]">
          <GhostButton onClick={() => setIsPastPrescriptionsDialogOpen(true)}>
            Past Rx
          </GhostButton>
          <GhostButton onClick={() => setIsPrescriptionsDialogOpen(true)}>
            Add Rx
          </GhostButton>
          <Separator orientation="vertical" />
        </div>
      </div>

      {/* Medication Dialog */}
      <PatientMedicationDialog
        userDetailsId={userDetailsId}
        isOpen={isPrescriptionsDialogOpen}
        onClose={() => setIsPrescriptionsDialogOpen(false)}
      />

      {/* Past Prescriptions Dialog */}
      <PastPrescriptionsDialog
        isDialogOpen={isPastPrescriptionsDialogOpen}
        userDetailsId={userDetailsId}
        onClose={() => setIsPastPrescriptionsDialogOpen(false)}
      />

      {/* Allergies and Active Medications */}
      <AllergiesAndMedications userDetailsId={userDetailsId} />
      <Separator />
    </div>
  );
}

export default QuickRx;
