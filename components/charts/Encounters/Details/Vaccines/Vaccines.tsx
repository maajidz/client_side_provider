import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import VaccinesDialog from "./VaccinesDialog";
import { UserEncounterData } from "@/types/chartsInterface";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const Vaccines = ({
  patientDetails,
}: {
  patientDetails: UserEncounterData;
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  return (
    <div className="flex flex-col gap-3">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="vaccines">
          <div className="flex justify-between items-center">
            <AccordionTrigger>Vaccines</AccordionTrigger>
            <Button
              variant="ghost"
              onClick={() => {
                setIsDialogOpen(true);
              }}
            >
              <PlusCircle />
            </Button>
            <VaccinesDialog
              userDetailsId={patientDetails.userDetails.id}
              isOpen={isDialogOpen}
              onClose={() => {
                setIsDialogOpen(false);
              }}
            />
          </div>
          <AccordionContent className="sm:max-w-4xl"></AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Vaccines;
