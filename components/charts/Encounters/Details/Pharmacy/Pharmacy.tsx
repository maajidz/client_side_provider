import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { UserEncounterData } from "@/types/chartsInterface";
import PharmacyDialog from "./PharmacyDialog";
import PharmacyList from "./PharmacyList";
import { PlusCircle } from "lucide-react";
import { useState } from "react";

interface PharmacyProps {
  patientDetails: UserEncounterData;
}

const Pharmacy = ({ patientDetails }: PharmacyProps) => {
  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="pharmacy">
          <div className="flex justify-between items-center">
            <AccordionTrigger>Pharmacy</AccordionTrigger>
            <Button variant="ghost" onClick={() => setIsDialogOpen(true)}>
              <PlusCircle />
            </Button>
            <PharmacyDialog
              isOpen={isDialogOpen}
              userDetailsId={patientDetails.userDetails.id}
              onClose={() => setIsDialogOpen(false)}
            />
          </div>
          <AccordionContent className="sm:max-w-4xl">
            <PharmacyList patientDetails={patientDetails} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Pharmacy;
