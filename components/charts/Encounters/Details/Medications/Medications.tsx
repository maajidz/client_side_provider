import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AddMedicationDialog from "./AddMedicationDialog";
import { UserEncounterData } from "@/types/chartsInterface";
import MedicationPrescriptionsList from "./MedicationPrescriptionsList";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";

interface MedicationsProps {
  patientDetails: UserEncounterData;
}

const Medications = ({ patientDetails }: MedicationsProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  return (
    <div className="flex flex-col gap-3 group">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="medications">
          <div className="flex justify-between items-center">
            <AccordionTrigger>Medications</AccordionTrigger>
            <Button variant="ghost" onClick={()=> setIsDialogOpen(true)} className="invisible group-hover:visible">
              <PlusCircle />
            </Button>
            <AddMedicationDialog
              userDetailsId={patientDetails.userDetails.id}
              onClose={() => {
                setIsDialogOpen(false);
              }}
              isOpen={isDialogOpen}
            />
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
