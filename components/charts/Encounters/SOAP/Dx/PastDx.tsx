import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserEncounterData } from "@/types/chartsInterface";
import PastDxBody from "./PastDxBody";
import { Button } from "@/components/ui/button";

const PastDx = ({ patientDetails }: { patientDetails: UserEncounterData }) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant={"ghost"}>Past Dx</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle asChild>Past Diagnoses</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <PastDxBody patientDetails={patientDetails} />
      </DialogContent>
    </Dialog>
  );
};

export default PastDx;
