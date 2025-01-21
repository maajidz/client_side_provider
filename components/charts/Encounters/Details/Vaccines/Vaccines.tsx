import React, { useCallback, useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import VaccinesDialog from "./VaccinesDialog";
import {
  HistoricalVaccineInterface,
  UserEncounterData,
} from "@/types/chartsInterface";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { getHistoricalVaccine } from "@/services/chartDetailsServices";
import LoadingButton from "@/components/LoadingButton";

const Vaccines = ({
  patientDetails,
}: {
  patientDetails: UserEncounterData;
}) => {
  // Historical Vaccine State
  const [historicalVaccineData, setHistoricalVaccineData] = useState<
    HistoricalVaccineInterface[]
  >([]);

  // Loading State
  const [loading, setLoading] = useState(false);

  // Error State
  const [error, setError] = useState("");

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  // GET Historical Vaccine Data
  const fetchHistoricalVaccine = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getHistoricalVaccine("");

      if (response) {
        setHistoricalVaccineData(response.data);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError("Could not fetch vaccines data");
      } else {
        setError("Could not fetch vaccines data. Unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Effects
  useEffect(() => {
    fetchHistoricalVaccine();
  }, [fetchHistoricalVaccine]);

  return (
    <div className="flex flex-col gap-3">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="vaccines">
          <div className="flex justify-between items-center">
            <AccordionTrigger>Vaccines</AccordionTrigger>
            <Button
              variant="ghost"
              onClick={() => {
                setIsDialogOpen(true);
              }}
            >
              <PlusCircle />
            </Button>
            <VaccinesDialog
              userDetailsId={patientDetails.userDetails.id}
              isOpen={isDialogOpen}
              onClose={() => {
                setIsDialogOpen(false);
              }}
            />
          </div>
          <AccordionContent className="sm:max-w-4xl">
            {loading ? (
              <LoadingButton />
            ) : error ? (
              <p className="text-center">{error}</p>
            ) : historicalVaccineData.length > 0 ? (
              <ul>
                {historicalVaccineData.map((vaccine) => (
                  <li key={vaccine.id} className="border-b py-2">
                    <p className="font-bold">{vaccine.vaccine_name}</p>
                    <p>Date: {vaccine.date}</p>
                    <p>Notes: {vaccine.notes}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No vaccine data available.</p>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Vaccines;
