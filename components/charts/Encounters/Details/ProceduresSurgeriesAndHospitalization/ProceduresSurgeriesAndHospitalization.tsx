import React, { useCallback, useEffect, useState } from "react";
import ProceduresSurgeriesAndHospitalizationDialog from "./ProceduresSurgeriesAndHospitalizationDialog";
import { UserEncounterData } from "@/types/chartsInterface";
import {
  deleteProcedure,
  getProcedureData,
} from "@/services/chartDetailsServices";
import LoadingButton from "@/components/LoadingButton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { showToast } from "@/utils/utils";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Edit2, PlusCircle, Trash2Icon } from "lucide-react";
import {
  ProcedureResponse,
  UpdateProceduresInterface,
} from "@/types/procedureInterface";
import FormLabels from "@/components/custom_buttons/FormLabels";

const ProceduresSurgeriesAndHospitalization = ({
  patientDetails,
}: {
  patientDetails: UserEncounterData;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const [data, setData] = useState<ProcedureResponse>();
  const [editData, setEditData] = useState<UpdateProceduresInterface | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const fetchProcedures = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getProcedureData({
        userDetailsId: patientDetails.userDetails.id,
        page: 1,
        limit: 5,
      });
      if (response) {
        setData(response);
      }
    } catch (e) {
      console.log("Error", e);
    } finally {
      setLoading(false);
    }
  }, [patientDetails.userDetails.id]);

  useEffect(() => {
    fetchProcedures();
  }, [fetchProcedures]);

  const handleDeleteProcedure = async (alertId: string) => {
    setLoading(true);
    try {
      await deleteProcedure({ id: alertId });
      showToast({
        toast,
        type: "success",
        message: `Procedure deleted successfully`,
      });
    } catch (e) {
      showToast({ toast, type: "error", message: `Error` });
      console.log("Error:", e);
    } finally {
      fetchProcedures();
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingButton />;
  }

  return (
    <div className="flex flex-col gap-3">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="proceduresSurgeriesAndHospitalizationDialog">
          <div className="flex justify-between items-center">
            <AccordionTrigger>
              Procedures, Surgeries, and Hospitalization
            </AccordionTrigger>
            <Button
              variant="ghost"
              onClick={() => {
                setEditData(null);
                setIsDialogOpen(true);
              }}
            >
              <PlusCircle />
            </Button>
            <ProceduresSurgeriesAndHospitalizationDialog
              userDetailsId={patientDetails.userDetails.id}
              procedureData={editData}
              isOpen={isDialogOpen}
              onClose={() => {
                setIsDialogOpen(false);
                fetchProcedures();
              }}
            />
          </div>
          <AccordionContent className="sm:max-w-4xl">
            <div className="flex flex-col gap-3">
              {data?.data &&
                data.data.flatMap((procedure, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-2 border rounded-lg p-2"
                  >
                    <div className="flex justify-between items-center">
                      <div className="text-base font-semibold">
                        {procedure.type}
                      </div>
                      <div className="flex">
                        <Button
                          variant={"ghost"}
                          onClick={() => {
                            setEditData({
                              id: procedure.id,
                              type: procedure.type,
                              nameId: procedure.nameId,
                              fromDate: procedure.fromDate,
                              toDate: procedure.toDate,
                              notes: procedure.notes,
                              userDetailsId: procedure.userDetailsId,
                            });
                            setIsDialogOpen(true);
                          }}
                        >
                          <Edit2 color="#84012A" />
                        </Button>
                        <Button
                          variant={"ghost"}
                          onClick={() => handleDeleteProcedure(procedure.id)}
                        >
                          <Trash2Icon color="#84012A" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 ">
                      <FormLabels label="Name" value={procedure.nameId} />
                      <FormLabels
                        label="From date"
                        value={procedure.fromDate.split("T")[0]}
                      />
                      <FormLabels
                        label="To date"
                        value={procedure.toDate?.split("T")[0] ?? ""}
                      />
                      <FormLabels label="Notes" value={procedure.notes} />
                    </div>
                  </div>
                ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ProceduresSurgeriesAndHospitalization;
