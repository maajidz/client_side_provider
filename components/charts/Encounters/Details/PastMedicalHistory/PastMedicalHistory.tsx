import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { UserEncounterData } from "@/types/chartsInterface";
import PastMedicalHistoryDialog from "./PastMedicalHistoryDialog";
import PastMedicalHistoryList from "./PastMedicalHistoryList";

interface PastMedicalHistoryProps {
  patientDetails: UserEncounterData;
}

const PastMedicalHistory = ({ patientDetails }: PastMedicalHistoryProps) => {
  return (
    <div className="flex flex-col gap-3">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="pastMedicalHistory">
          <div className="flex justify-between items-center">
            <AccordionTrigger>Past Medical History</AccordionTrigger>
            <PastMedicalHistoryDialog patientDetails={patientDetails} />
          </div>
          <AccordionContent className="sm:max-w-4xl">
            <PastMedicalHistoryList patientDetails={patientDetails} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default PastMedicalHistory;
