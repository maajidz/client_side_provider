import { Button } from "@/components/ui/button";
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
          <Button
            variant="ghost"
            className="text-blue-500 bg-[#f4f4f5] hover:bg-white-200 hover:text-blue-500 hover:underline"
            onClick={() => setIsPastPrescriptionsDialogOpen(true)}
          >
            Past Rx
          </Button>
          <Button
            variant="ghost"
            className="text-blue-500 bg-[#f4f4f5] hover:bg-white-200 hover:text-blue-500 hover:underline"
            onClick={() => setIsPrescriptionsDialogOpen(true)}
          >
            Add Rx
          </Button>
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

