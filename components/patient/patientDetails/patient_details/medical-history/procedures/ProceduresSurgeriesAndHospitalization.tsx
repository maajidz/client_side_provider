"use client";

import ProceduresSurgeriesAndHospitalizationDialog from "@/components/charts/Encounters/Details/ProceduresSurgeriesAndHospitalization/ProceduresSurgeriesAndHospitalizationDialog";
import { Button } from "@/components/ui/button";
import ProceduresSurgeriesAndHospitalizationClient from "./client";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

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
        <Button
          variant="ghost"
          className="text-blue-500 hover:text-blue-500 hover:bg-[#f0f0f0]"
          onClick={() => setIsOpen(true)}
        >
          Add
        </Button>
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
