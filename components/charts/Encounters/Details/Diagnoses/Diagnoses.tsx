import React from "react";
import AddDx from "../../SOAP/Dx/AddDx";
import { UserEncounterData } from "@/types/chartsInterface";
import PastDxBody from "../../SOAP/Dx/PastDxBody";
import {
  Accordion,
  AccordionTrigger,
  AccordionItem,
  AccordionContent,
} from "@/components/ui/accordion";

const Diagnoses = ({
  patientDetails,
  encounterId,
}: {
  patientDetails: UserEncounterData;
  encounterId: string;
}) => {
  return (
    <div className="flex flex-col gap-3 group">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="diagnoses">
          <div className="flex justify-between items-center">
            <AccordionTrigger>Diagnoses</AccordionTrigger>
            <AddDx patientDetails={patientDetails} encounterId={encounterId} />
          </div>
          <AccordionContent className="sm:max-w-4xl">
            <PastDxBody patientDetails={patientDetails} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Diagnoses;
