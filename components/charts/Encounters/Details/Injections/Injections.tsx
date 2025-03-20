import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Edit2Icon,
  PlusCircle,
  Trash2Icon,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import InjectionsDialog from "./InjectionsDialog";
import { UserEncounterData } from "@/types/chartsInterface";
import {
  InjectionsData,
  InjectionsResponse,
} from "@/types/injectionsInterface";
import { useToast } from "@/hooks/use-toast";
import { deleteInjection, getInjection } from "@/services/injectionsServices";
import { showToast } from "@/utils/utils";
import FormLabels from "@/components/custom_buttons/FormLabels";
import AccordionShimmerCard from "@/components/custom_buttons/shimmer/AccordionCardShimmer";

const Injections = ({
  patientDetails,
}: {
  patientDetails: UserEncounterData;
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const [injectionsData, setInjectionsData] = useState<InjectionsResponse>();
  const [editData, setEditData] = useState<InjectionsData | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  // Pagination State
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 3;

  const { toast } = useToast();

  const fetchInjectionsData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getInjection({
        page: page,
        limit: limit,
        userDetailsId: patientDetails.userDetails.userDetailsId,
      });

      if (response) {
        setInjectionsData(response);
        setTotalPages(Math.ceil(response.total / limit));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [patientDetails.userDetails.userDetailsId, page, limit]);

  useEffect(() => {
    fetchInjectionsData();
  }, [fetchInjectionsData]);

  const handleDeleteInjection = async (injectionId: string) => {
    setLoading(true);
    try {
      await deleteInjection({ injectionId: injectionId });
      showToast({
        toast,
        type: "success",
        message: `Injection deleted successfully`,
      });
      fetchInjectionsData();
    } catch (e) {
      showToast({ toast, type: "error", message: `Error` });
      console.log("Error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-3 group">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="familyHistory">
            <div className="flex justify-between items-center">
              <AccordionTrigger>Injections</AccordionTrigger>
              <Button
                variant="ghost"
                onClick={() => {
                  setEditData(null);
                  setIsDialogOpen(true);
                }}
                className="invisible group-hover:visible"
              >
                <PlusCircle />
              </Button>
              <InjectionsDialog
                userDetailsId={patientDetails.userDetails.userDetailsId}
                injectionsData={editData}
                onClose={() => {
                  setIsDialogOpen(false);
                  fetchInjectionsData();
                  setEditData(null);
                }}
                isOpen={isDialogOpen}
              />
            </div>
            <AccordionContent className="sm:max-w-4xl">
              {loading ? (
                <AccordionShimmerCard />
              ) : injectionsData ? (
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
                  {injectionsData?.data.map((injections) => (
                    <div
                      key={injections.id}
                      className="flex flex-row justify-between border rounded-md w-full p-3"
                    >
                      <div>
                        <FormLabels
                          label={injections.injectionType.injection_name}
                          value=""
                        />
                        <FormLabels
                          label="Intake"
                          value={`${injections.dosage_quantity} ${injections.dosage_unit},  ${injections.frequency}    ${injections.period_number} ${injections.period_unit} ,  ${injections.parental_route} ${injections.site}`}
                        />
                        <FormLabels
                          label="Lot number"
                          value={`${injections.lot_number}`}
                        />
                        <FormLabels
                          label="Expiration date"
                          value={`${injections.expiration_date.split("T")[0]}`}
                        />
                        <FormLabels
                          label="Note to nurse"
                          value={`${injections.note_to_nurse}`}
                        />
                        <FormLabels
                          label="comments"
                          value={`${injections.comments}`}
                        />
                        <FormLabels
                          label="Administered date"
                          value={`${
                            injections.administered_date.split("T")[0]
                          }`}
                        />
                      </div>
                      <div>
                        <Button
                          variant={"ghost"}
                          className="text-[#84012A]"
                          onClick={() => {
                            setEditData(injections);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Edit2Icon />
                        </Button>
                        <Button
                          variant={"ghost"}
                          className="text-[#84012A]"
                          onClick={() => handleDeleteInjection(injections.id)}
                        >
                          <Trash2Icon />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div> No data </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
};

export default Injections;
