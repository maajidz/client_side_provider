import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { getSupplements } from "@/services/chartDetailsServices";
import { UserEncounterData } from "@/types/chartsInterface";
import { SupplementInterfaceResponse } from "@/types/supplementsInterface";
import SupplementsDialog from "./SupplementsDialog";
import SupplementList from "./SupplementsList";
import { PlusCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import AccordionShimmerCard from "@/components/custom_buttons/shimmer/AccordionCardShimmer";

interface SupplementsProps {
  patientDetails: UserEncounterData;
}

const Supplements = ({ patientDetails }: SupplementsProps) => {
  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  // Data States
  const [supplementData, setSupplementData] =
    useState<SupplementInterfaceResponse[]>();

  // Loading State
  const [loading, setLoading] = useState(false);

  // Error State
  const [error, setError] = useState("");

  // GET Supplements
  const fetchSupplements = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getSupplements({
        userDetailsId: patientDetails.userDetails.userDetailsId,
      });

      if (response) {
        setSupplementData(response.data);
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
  }, [patientDetails.userDetails.userDetailsId]);

  useEffect(() => {
    fetchSupplements();
  }, [fetchSupplements]);

  return (
    <div className="flex flex-col gap-3 group">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="supplements">
          <div className="flex justify-between items-center">
            <AccordionTrigger>Supplements</AccordionTrigger>
            <Button
              variant="ghost"
              onClick={() => setIsDialogOpen(true)}
              className="invisible group-hover:visible"
            >
              <PlusCircle />
            </Button>
            <SupplementsDialog
              userDetailsId={patientDetails?.userDetails.userDetailsId}
              onClose={() => {
                setIsDialogOpen(false);
              }}
              isOpen={isDialogOpen}
            />
          </div>
          <AccordionContent className="sm:max-w-4xl">
            {loading ? (
              <AccordionShimmerCard />
            ) : (
              <SupplementList
                error={error}
                patientDetails={patientDetails}
                supplementData={supplementData}
                fetchSupplements={fetchSupplements}
              />
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Supplements;
