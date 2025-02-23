"use client";

import PharmacyDialog from "@/components/charts/Encounters/Details/Pharmacy/PharmacyDialog";
import ERxPharmacyTable from "./ERxPharmacyTable";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ERxPharmacyProps {
  userDetailsId: string;
}

function ERxPharmacy({ userDetailsId }: ERxPharmacyProps) {
  // Dialog State
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-4 items-center text-lg font-semibold">
        <span>eRx Pharmacy</span>
        <Button variant="ghost" onClick={() => setIsOpen(true)}>Add</Button>
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
