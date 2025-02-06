"use client";

import GhostButton from "@/components/custom_buttons/GhostButton";
import ProceduresSurgeriesAndHospitalizationDialog from "@/components/charts/Encounters/Details/ProceduresSurgeriesAndHospitalization/ProceduresSurgeriesAndHospitalizationDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import ProceduresSurgeriesAndHospitalizationClient from "./client";
import { useState } from "react";

interface ProceduresSurgeriesAndHospitalizationProps {
  userDetailsId: string;
}

function ProceduresSurgeriesAndHospitalization({
  userDetailsId,
}: ProceduresSurgeriesAndHospitalizationProps) {
  // Dialog State
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center p-4 text-lg font-semibold rounded-md bg-[#f0f0f0]">
        <span>Procedures, Surgeries and Hospitalization</span>
        <GhostButton label="Add" onClick={() => setIsOpen(true)} />
        <ProceduresSurgeriesAndHospitalizationDialog
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          userDetailsId={userDetailsId}
        />
      </div>
      <ScrollArea className="h-[12.5rem] min-h-10">
        <ProceduresSurgeriesAndHospitalizationClient
          userDetailsId={userDetailsId}
        />
      </ScrollArea>
    </div>
  );
}

export default ProceduresSurgeriesAndHospitalization;
