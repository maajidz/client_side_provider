import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AllergiesDialog from "./AllergiesDialog";
import { UserEncounterData } from "@/types/chartsInterface";
import { useCallback, useEffect, useState } from "react";
import { getAllergiesData } from "@/services/chartDetailsServices";
import LoadingButton from "@/components/LoadingButton";

const Allergies = ({patientDetails}: {patientDetails: UserEncounterData}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const fetchAllergies = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllergiesData({ limit: 10, page: 1, userDetailsId: patientDetails.userDetails.id });
      if (response) {

      }
    } catch (e) {
      console.log('Error', e);
    } finally {
      setLoading(false);
    }
  }, [patientDetails?.userDetails.id]);


  useEffect(() => {
    fetchAllergies();
  }, [fetchAllergies]);


  if (loading) {
    return <LoadingButton />;
  }
  
  return (
    <div className="flex flex-col gap-3">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="allergies">
          <div className="flex justify-between items-center">
            <AccordionTrigger>Allergies</AccordionTrigger>
            <AllergiesDialog patientDetails={patientDetails}/>
          </div>
          <AccordionContent></AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Allergies;
