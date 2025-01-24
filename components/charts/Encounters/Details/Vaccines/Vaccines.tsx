import React, { useCallback, useState } from "react";
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
import VaccinesList from "./VaccinesList";
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

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Loading State
  const [loading, setLoading] = useState(false);

  // Error State
  const [error, setError] = useState("");

  // Edit State
  const [editData, setEditData] = useState<
    HistoricalVaccineInterface | undefined
  >(undefined);

  // GET Historical Vaccine Data
  const fetchHistoricalVaccine = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getHistoricalVaccine({ userDetailsId: "" });

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

  const handleAccordionChange = (value: string | null) => {
    if (value === "vaccines") {
      fetchHistoricalVaccine();
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <Accordion
        type="single"
        collapsible
        className="w-full"
        onValueChange={handleAccordionChange}
      >
        <AccordionItem value="vaccines">
          <div className="flex justify-between items-center">
            <AccordionTrigger>Vaccines</AccordionTrigger>
            <Button
              variant="ghost"
              onClick={() => {
                setEditData(undefined);
                setIsDialogOpen(true);
              }}
            >
              <PlusCircle />
            </Button>
            <VaccinesDialog
              key={isDialogOpen ? "dialog-open" : "dialog-closed"}
              userDetailsId={patientDetails.userDetails.id}
              isOpen={isDialogOpen}
              onClose={() => {
                setIsDialogOpen(false);
              }}
              vaccinesData={editData}
              onFetchHistoricalData={fetchHistoricalVaccine}
            />
          </div>
          {loading ? (
            <LoadingButton />
          ) : (
            <AccordionContent className="sm:max-w-4xl">
              <VaccinesList
                historicalVaccineData={historicalVaccineData}
                error={error}
                onDialogOpen={setIsDialogOpen}
                onFetchHistoricalData={fetchHistoricalVaccine}
                onSetVaccineData={setEditData}
              />
            </AccordionContent>
          )}
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Vaccines;
