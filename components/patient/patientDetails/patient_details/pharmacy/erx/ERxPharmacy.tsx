"use client";

import GhostButton from "@/components/custom_buttons/buttons/GhostButton";
import PharmacyDialog from "@/components/charts/Encounters/Details/Pharmacy/PharmacyDialog";
import ERxPharmacyTable from "./ERxPharmacyTable";
import { useState } from "react";

interface ERxPharmacyProps {
  userDetailsId: string;
}

function ERxPharmacy({ userDetailsId }: ERxPharmacyProps) {
  // Dialog State
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center p-4 text-lg font-semibold rounded-md bg-[#f0f0f0]">
        <span>eRx Pharmacy</span>
        <GhostButton onClick={() => setIsOpen(true)}>Add</GhostButton>
        <PharmacyDialog
          isOpen={isOpen}
          userDetailsId={userDetailsId}
          onClose={() => setIsOpen(false)}
        />
      </div>
      <ERxPharmacyTable userDetailsId={userDetailsId} />
    </div>
  );
}

export default ERxPharmacy;
