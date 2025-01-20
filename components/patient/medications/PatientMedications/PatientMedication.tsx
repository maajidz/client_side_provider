import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import React, { useState } from "react";
import AddMedicationDialog from "@/components/charts/Encounters/Details/Medications/AddMedicationDialog";
import PatientMedicationDialog from "./PatientMedicationDialog";

const PatientMedication = ({ userDetailsId }: { userDetailsId: string }) => {
  const [isMedicationsDialogOpen, setIsMedicationsDialogOpen] =
    useState<boolean>(false);
  const [isPrescriptionsDialogOpen, setIsPrescriptionsDialogOpen] =
    useState<boolean>(false);
  return (
    <>
      <div className="flex gap-5 justify-end">
        <Button
          className="bg-[#84012A]"
          onClick={() => {
            setIsMedicationsDialogOpen(true);
          }}
        >
          <div className="flex gap-2">
            <PlusIcon />
            Medications
          </div>
        </Button>
        <Button
          className="bg-[#84012A]"
          onClick={() => {
            setIsPrescriptionsDialogOpen(true);
          }}
        >
          <div className="flex gap-2">
            <PlusIcon />
            Prescriptions
          </div>
        </Button>
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
