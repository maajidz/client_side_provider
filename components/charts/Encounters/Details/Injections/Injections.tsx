import { Button } from "@/components/ui/button";
import { Edit2Icon, PlusCircle, Trash2Icon } from "lucide-react";
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
import LoadingButton from "@/components/LoadingButton";
import FormLabels from "@/components/custom_buttons/FormLabels";

const Injections = ({
  patientDetails,
}: {
  patientDetails: UserEncounterData;
}) => {
  const [editData, setEditData] = useState<InjectionsData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [injectionsData, setInjectionsData] = useState<InjectionsResponse>();

  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchInjectionsData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getInjection({
        page: 1,
        limit: 10,
        userDetailsId: patientDetails.userDetails.id,
      });

      if (response) {
        setInjectionsData(response);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [patientDetails.userDetails.id]);

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

  if (loading) return <LoadingButton />;

  return (
    <>
      <div className="flex flex-col gap-3">
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
              >
                <PlusCircle />
              </Button>
              <InjectionsDialog
                userDetailsId={patientDetails.userDetails.id}
                injectionsData={editData}
                onClose={() => {
                  setIsDialogOpen(false);
                    fetchInjectionsData();
                }}
                isOpen={isDialogOpen}
              />
            </div>
            <AccordionContent className="sm:max-w-4xl">
              {injectionsData ? (
                injectionsData?.data.map((injections) => (
                  <div
                    key={injections.id}
                    className="flex flex-row justify-between border rounded-md w-full p-3"
                  >
                    <div>
                      <FormLabels label={injections.injection_name} value="" />
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
                        value={`${injections.administered_date.split("T")[0]}`}
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
                ))
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
