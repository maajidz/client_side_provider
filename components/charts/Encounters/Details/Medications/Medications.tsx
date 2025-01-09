import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AddMedicationDialog from "./AddMedicationDialog";
import { UserEncounterData } from "@/types/chartsInterface";
import MedicationPrescriptionsList from "./MedicationPrescriptionsList";

interface MedicationsProps {
  patientDetails: UserEncounterData;
}

const Medications = ({ patientDetails }: MedicationsProps) => {
  return (
    <div className="flex flex-col gap-3">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="medications">
          <div className="flex justify-between items-center">
            <AccordionTrigger>Medications</AccordionTrigger>
            <AddMedicationDialog patientDetails={patientDetails} />
          </div>
          <AccordionContent className="sm:max-w-4xl">
            <MedicationPrescriptionsList />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Medications;
