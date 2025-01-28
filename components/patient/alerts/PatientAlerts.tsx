import AlertDialog from "@/components/charts/Encounters/Details/Alerts/AlertDialog";
import { PlusIcon } from "lucide-react";
import React, { useState } from "react";
import ViewPatientAlerts from "./ViewPatientAlerts";
import DefaultButton from "@/components/custom_buttons/buttons/DefaultButton";

const PatientAlerts = ({ userDetailsId }: { userDetailsId: string }) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  return (
    <>
      <div className="flex justify-end">
        <DefaultButton
          onClick={() => {
            setIsDialogOpen(true);
          }}
        >
          <div className="flex gap-2">
            <PlusIcon />
            Alerts
          </div>
        </DefaultButton>
        <AlertDialog
          userDetailsId={userDetailsId}
          onClose={() => {
            setIsDialogOpen(false);
          }}
          isOpen={isDialogOpen}
        />
      </div>
      <ViewPatientAlerts userDetailsId={userDetailsId} />
    </>
  );
};

export default PatientAlerts;
