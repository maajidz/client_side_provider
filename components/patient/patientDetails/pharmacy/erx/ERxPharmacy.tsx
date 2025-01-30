"use client";

import PharmacyDialog from "@/components/charts/Encounters/Details/Pharmacy/PharmacyDialog";
import { Button } from "@/components/ui/button";
import ERxPharmacyClient from "./client";
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
        <Button
          variant="ghost"
          className="text-blue-500 hover:text-blue-500 hover:bg-[#f0f0f0]"
          onClick={() => setIsOpen(true)}
        >
          Add
        </Button>
        <PharmacyDialog
          isOpen={isOpen}
          userDetailsId={userDetailsId}
          onClose={() => setIsOpen(false)}
        />
      </div>
      <ERxPharmacyClient userDetailsId={userDetailsId} />
    </div>
  );
}

export default ERxPharmacy;
