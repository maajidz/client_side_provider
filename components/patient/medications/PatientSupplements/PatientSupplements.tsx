import SupplementsDialog from "@/components/charts/Encounters/Details/Supplements/SupplementsDialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import React, { useState } from "react";
import ViewPatientSupplements from "./ViewPatientSupplements";

const PatientSupplements = ({ userDetailsId }: { userDetailsId: string }) => {
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
            Supplements
          </div>
        </Button>
        <SupplementsDialog
          userDetailsId={userDetailsId}
          onClose={() => {
            setIsDialogOpen(false);
          }}
          isOpen={isDialogOpen}
        />
      </div>
      <ViewPatientSupplements userDetailsId={userDetailsId} />
    </>
  );
};

export default PatientSupplements;
