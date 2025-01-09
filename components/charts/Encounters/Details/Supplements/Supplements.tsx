import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { UserEncounterData } from "@/types/chartsInterface";
import SupplementsDialog from "./SupplementsDialog";
import SupplementList from "./SupplementsList";

interface SupplementsProps {
  patientDetails: UserEncounterData;
}

const Supplements = ({ patientDetails }: SupplementsProps) => {
  return (
    <div className="flex flex-col gap-3">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="supplements">
          <div className="flex justify-between items-center">
            <AccordionTrigger>Supplements</AccordionTrigger>
            <SupplementsDialog patientDetails={patientDetails} />
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
