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
  HistoricalVaccineResponseInterface,
  UserEncounterData,
} from "@/types/chartsInterface";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Edit2Icon, PlusCircle, Trash2Icon } from "lucide-react";
import {
  deleteHistoricalVaccine,
  getHistoricalVaccine,
} from "@/services/chartDetailsServices";
import { useToast } from "@/hooks/use-toast";
import AccordionShimmerCard from "@/components/custom_buttons/shimmer/AccordionCardShimmer";
import { showToast } from "@/utils/utils";

const Vaccines = ({
  patientDetails,
}: {
  patientDetails: UserEncounterData;
}) => {
  // Historical Vaccine State
  const [historicalVaccineData, setHistoricalVaccineData] =
    useState<HistoricalVaccineResponseInterface>();

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Loading State
  const [loading, setLoading] = useState(false);

  // Edit State
  const [editData, setEditData] = useState<
    HistoricalVaccineInterface | undefined
  >(undefined);

  // Pagination State
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 3;

  const { toast } = useToast();

  // GET Historical Vaccine Data
  const fetchHistoricalVaccine = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getHistoricalVaccine({
        userDetailsId: patientDetails.userDetails.userDetailsId,
        page: page,
        limit: limit,
      });

      if (response) {
        setHistoricalVaccineData(response);
        setTotalPages(Math.ceil(response.total / limit));
      }
    } catch (err) {
      showToast({
        toast,
        type: "error",
        message: `Error fetching historical vaccine data: ${err}`,
      });
    } finally {
      setLoading(false);
    }
  }, [patientDetails?.userDetails.userDetailsId, page, limit, toast]);

  const handleAccordionChange = (value: string | null) => {
    if (value === "vaccines") {
      fetchHistoricalVaccine();
    }
  };

  // DELETE Historical Vaccine
  const handleDeleteHistoricalVaccine = async (id: string) => {
    setLoading(true);

    try {
      await deleteHistoricalVaccine({ id });

      showToast({
        toast,
        type: "success",
        message: "Historical vaccine deleted successfully",
      });
    } catch (err) {
      if (err instanceof Error) {
        showToast({
          toast,
          type: "error",
          message: "Could not delete historical vaccine",
        });
      } else {
        showToast({
          toast,
          type: "error",
          message:
            "Could not delete historical vaccine. Unknown error occurred",
        });
      }
    } finally {
      setLoading(false);
      fetchHistoricalVaccine();
    }
  };

  return (
    <div className="flex flex-col gap-3 group">
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
              className="invisible group-hover:visible"
            >
              <PlusCircle />
            </Button>
            <VaccinesDialog
              key={isDialogOpen ? "dialog-open" : "dialog-closed"}
              userDetailsId={patientDetails.userDetails.userDetailsId}
              isOpen={isDialogOpen}
              onClose={() => {
                setIsDialogOpen(false);
                fetchHistoricalVaccine();
                setEditData(undefined);
              }}
              vaccinesData={editData}
              onFetchHistoricalData={fetchHistoricalVaccine}
            />
          </div>
          <AccordionContent className="sm:max-w-4xl">
            {loading ? (
              <AccordionShimmerCard />
            ) : historicalVaccineData?.total ? (
              <div className="flex flex-col gap-2">
                <div className="space-x-2 self-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={page <= 1}
                  >
                    <ChevronLeft />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page >= totalPages}
                  >
                    <ChevronRight />
                  </Button>
                </div>
                {historicalVaccineData.data && (
                  <ul>
                    {historicalVaccineData?.data.map((vaccine) => (
                      <li key={vaccine.id} className="border-b py-2">
                        <div className="flex justify-between items-center">
                          <p className="font-bold">{vaccine.vaccine_name}</p>
                          <div className="flex items-center">
                            <Button
                              variant="ghost"
                              onClick={() => {
                                setEditData(vaccine);
                                setIsDialogOpen(true);
                              }}
                            >
                              <Edit2Icon color="#84012A" />
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => {
                                handleDeleteHistoricalVaccine(vaccine?.id);
                              }}
                              disabled={loading}
                            >
                              <Trash2Icon color="#84012A" />
                            </Button>
                          </div>
                        </div>
                        <p>Date: {vaccine.date}</p>
                        <p>
                          Source:{" "}
                          {vaccine.source === ""
                            ? "Source not specified"
                            : vaccine.source}
                        </p>
                        <p>
                          Notes:{" "}
                          {vaccine.notes === "" ? "No notes" : vaccine.notes}
                        </p>
                        <p>
                          # In Series:{" "}
                          {vaccine.in_series === ""
                            ? "Not specified"
                            : vaccine.in_series}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <div className="text-center">No Vaccine data found!</div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Vaccines;
