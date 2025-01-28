import { PlusIcon } from "lucide-react";
import React, { useState } from "react";
import AddMedicationDialog from "@/components/charts/Encounters/Details/Medications/AddMedicationDialog";
import PatientMedicationDialog from "./PatientMedicationDialog";
import DefaultButton from "@/components/custom_buttons/buttons/DefaultButton";

const PatientMedication = ({ userDetailsId }: { userDetailsId: string }) => {
  const [isMedicationsDialogOpen, setIsMedicationsDialogOpen] =
    useState<boolean>(false);
  const [isPrescriptionsDialogOpen, setIsPrescriptionsDialogOpen] =
    useState<boolean>(false);
  return (
    <>
      <div className="flex gap-5 justify-end">
        <DefaultButton
          onClick={() => {
            setIsMedicationsDialogOpen(true);
          }}
        >
          <div className="flex gap-2">
            <PlusIcon />
            Medications
          </div>
        </DefaultButton>
        <DefaultButton
          onClick={() => {
            setIsPrescriptionsDialogOpen(true);
          }}
        >
          <div className="flex gap-2">
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
        <PatientMedicationDialog
          userDetailsId={userDetailsId}
          onClose={() => {
            setIsPrescriptionsDialogOpen(false);
          }}
          isOpen={isPrescriptionsDialogOpen}
        />
      </div>
      {/* <ViewPatientMedications userDetailsId={userDetailsId} /> */}
    </>
  );
};

export default PatientMedication;
