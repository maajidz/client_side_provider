import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { UserEncounterData } from "@/types/chartsInterface";
import PastMedicalHistoryDialog from "./PastMedicalHistoryDialog";
import PastMedicalHistoryList from "./PastMedicalHistoryList";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
interface PastMedicalHistoryProps {
  patientDetails: UserEncounterData;
}

const PastMedicalHistory = ({ patientDetails }: PastMedicalHistoryProps) => {
  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="pastMedicalHistory">
          <div className="flex justify-between items-center">
            <AccordionTrigger>Past Medical History</AccordionTrigger>
            <Button variant="ghost" onClick={() => setIsDialogOpen(true)}>
              <PlusCircle />
            </Button>
            <PastMedicalHistoryDialog
              isOpen={isDialogOpen}
              userDetailsId={patientDetails.userDetails.id}
              onClose={() => setIsDialogOpen(false)}
            />
          </div>
          <AccordionContent className="sm:max-w-4xl">
            <PastMedicalHistoryList
              patientDetails={patientDetails}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default PastMedicalHistory;
