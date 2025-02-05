import DefaultButton from "@/components/custom_buttons/buttons/DefaultButton";
import DiagnosesClient from "./client";
import { useState } from "react";
import { PlusIcon } from "lucide-react";
import AddDiagnosesDialog from "./AddDiagnosesDialog";

const PatientDiagnoses = ({ userDetailsId }: { userDetailsId: string }) => {
  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <div className="flex justify-end">
        <DefaultButton onClick={() => setIsDialogOpen(true)}>
            <PlusIcon />
            Diagnoses
        </DefaultButton>
      </div>
      <div className="space-y-4">
        <DiagnosesClient userDetailsId={userDetailsId} />

        {/* Add Diagnoses */}
        <AddDiagnosesDialog
          isOpen={isDialogOpen}
          userDetailsId={userDetailsId}
          onClose={() => setIsDialogOpen(false)}
        />
      </div>
    </>
  );
};

export default PatientDiagnoses;
