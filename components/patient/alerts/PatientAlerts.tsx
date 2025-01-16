import AlertDialog from "@/components/charts/Encounters/Details/Alerts/AlertDialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import React, { useState } from "react";
import ViewPatientAlerts from "./ViewPatientAlerts";

const PatientAlerts = ({ userDetailsId }: { userDetailsId: string }) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  return (
    <>
      <div className="flex justify-end">
        <Button
          className="bg-[#84012A]"
          onClick={() => {
            setIsDialogOpen(true);
          }}
        >
          <div className="flex gap-2">
            <PlusIcon />
            Alerts
          </div>
        </Button>
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
