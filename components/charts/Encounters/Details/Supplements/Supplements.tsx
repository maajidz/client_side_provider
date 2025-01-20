import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { UserEncounterData } from "@/types/chartsInterface";
import SupplementsDialog from "./SupplementsDialog";
import SupplementList from "./SupplementsList";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";

interface SupplementsProps {
  patientDetails: UserEncounterData;
}

const Supplements = ({ patientDetails }: SupplementsProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  return (
    <div className="flex flex-col gap-3">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="supplements">
          <div className="flex justify-between items-center">
            <AccordionTrigger>Supplements</AccordionTrigger>
            <Button variant="ghost">
              <PlusCircle />
            </Button>
            <SupplementsDialog
              userDetailsId={patientDetails?.userDetails.id}
              onClose={() => {
                setIsDialogOpen(false);
              }}
              isOpen={isDialogOpen}
            />
          </div>
          <AccordionContent className="sm:max-w-4xl">
            <SupplementList patientDetails={patientDetails} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Supplements;
