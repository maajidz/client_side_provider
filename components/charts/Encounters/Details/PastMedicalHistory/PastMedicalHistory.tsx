import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { getPastMedicalHistory } from "@/services/chartDetailsServices";
import { PastMedicalHistoryInterface } from "@/services/pastMedicalHistoryInterface";
import { UserEncounterData } from "@/types/chartsInterface";
import PastMedicalHistoryDialog from "./PastMedicalHistoryDialog";
import PastMedicalHistoryList from "./PastMedicalHistoryList";
import { PlusCircle } from "lucide-react";
import { useEffect, useCallback, useState } from "react";
interface PastMedicalHistoryProps {
  patientDetails: UserEncounterData;
}

const PastMedicalHistory = ({ patientDetails }: PastMedicalHistoryProps) => {
  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Data State
  const [medicalHistory, setMedicalHistory] = useState<
    PastMedicalHistoryInterface[]
  >([]);

  // Loading State
  const [loading, setLoading] = useState(false);

  // Error State
  const [error, setError] = useState("");

  // GET Past Medical History
  const fetchPastMedicalHistory = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getPastMedicalHistory({
        userDetailsId: patientDetails.userDetails.id,
        page: 1,
        limit: 5,
      });

      if (response) {
        setMedicalHistory(response.items);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError("Something went wrong");
      } else {
        setError("Something went wrong. Unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }, [patientDetails.userDetails.id]);

  // Effects
  useEffect(() => {
    fetchPastMedicalHistory();
  }, [fetchPastMedicalHistory]);

  return (
    <div className="flex flex-col gap-3 group">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="pastMedicalHistory">
          <div className="flex justify-between items-center">
            <AccordionTrigger>Past Medical History</AccordionTrigger>
            <Button variant="ghost" onClick={() => setIsDialogOpen(true)} className="invisible group-hover:visible">
              <PlusCircle />
            </Button>
            <PastMedicalHistoryDialog
              isOpen={isDialogOpen}
              userDetailsId={patientDetails.userDetails.id}
              onClose={() => {
                setIsDialogOpen(false);
                fetchPastMedicalHistory();
              }}
            />
          </div>
          <AccordionContent className="sm:max-w-4xl">
            <PastMedicalHistoryList
              error={error}
              isLoading={loading}
              medicalHistory={medicalHistory}
              patientDetails={patientDetails}
              fetchPastMedicalHistory={fetchPastMedicalHistory}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default PastMedicalHistory;
