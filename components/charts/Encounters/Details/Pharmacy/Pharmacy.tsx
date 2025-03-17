import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { UserEncounterData } from "@/types/chartsInterface";
import { UserPharmacyInterface } from "@/types/pharmacyInterface";
import { getUserPharmacyData } from "@/services/chartDetailsServices";
import PharmacyDialog from "./PharmacyDialog";
import PharmacyList from "./PharmacyList";
import { PlusCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface PharmacyProps {
  patientDetails: UserEncounterData;
}

const Pharmacy = ({ patientDetails }: PharmacyProps) => {
  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Data States
  const [pharmacyData, setPharmacyData] = useState<UserPharmacyInterface>();

  // Loading State
  const [loading, setLoading] = useState(false);

  // Error State
  const [error, setError] = useState("");

  // GET User Pharmacy
  const fetchUserPharmacy = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getUserPharmacyData({
        userDetailsId: patientDetails.userDetails.userDetailsId,
      });

      if (response) {
        setPharmacyData(response);
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

  // Effects
  useEffect(() => {
    fetchUserPharmacy();
  }, [fetchUserPharmacy]);

  return (
    <div className="flex flex-col gap-3 group">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="pharmacy">
          <div className="flex justify-between items-center">
            <AccordionTrigger>Pharmacy</AccordionTrigger>
            <Button variant="ghost" onClick={() => setIsDialogOpen(true)} className="invisible group-hover:visible">
              <PlusCircle />
            </Button>
            <PharmacyDialog
              isOpen={isDialogOpen}
              userDetailsId={patientDetails.userDetails.userDetailsId}
              onClose={() => {
                setIsDialogOpen(false);
                fetchUserPharmacy();
              }}
            />
          </div>
          <AccordionContent className="sm:max-w-4xl">
            <PharmacyList
              error={error}
              isLoading={loading}
              pharmacyData={pharmacyData}
              fetchUserPharmacy={fetchUserPharmacy}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Pharmacy;
