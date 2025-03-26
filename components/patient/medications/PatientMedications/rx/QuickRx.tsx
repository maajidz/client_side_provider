import AllergiesAndMedications from "./AllergiesAndMedications";
import PastPrescriptionsDialog from "./PastPrescriptionsDialog";
import PatientMedicationDialog from "./PatientMedicationDialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";

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
      <div className="flex">
        {/*  Add Rx and Past Rx  */}
        <div className="flex flex-row-reverse items-center gap-2 w-full">
          <Button
            variant={"link"}
            onClick={() => setIsPastPrescriptionsDialogOpen(true)}
          >
            Past Rx
          </Button>
          <Button
            variant={"link"}
            onClick={() => setIsPrescriptionsDialogOpen(true)}
          >
            Add Rx
          </Button>
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
    </div>
  );
}

export default QuickRx;
