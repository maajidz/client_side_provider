import React, { useCallback, useEffect, useState } from "react";
import ProceduresSurgeriesAndHospitalizationDialog from "./ProceduresSurgeriesAndHospitalizationDialog";
import { UserEncounterData } from "@/types/chartsInterface";
import {
  deleteProcedure,
  getProcedureData,
} from "@/services/chartDetailsServices";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { showToast } from "@/utils/utils";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Edit2, PlusCircle, Trash2Icon } from "lucide-react";
import {
  ProcedureResponse,
  UpdateProceduresInterface,
} from "@/types/procedureInterface";
import FormLabels from "@/components/custom_buttons/FormLabels";
import AccordionShimmerCard from "@/components/custom_buttons/shimmer/AccordionCardShimmer";

const ProceduresSurgeriesAndHospitalization = ({
  patientDetails,
}: {
  patientDetails: UserEncounterData;
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const [data, setData] = useState<ProcedureResponse>();
  const [editData, setEditData] = useState<UpdateProceduresInterface | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  // Pagination State
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 3;

  const { toast } = useToast();

  const fetchProcedures = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getProcedureData({
        userDetailsId: patientDetails.userDetails.userDetailsId,
        page: page,
        limit: limit,
      });
      if (response) {
        setData(response);
        setTotalPages(Math.ceil(response.total / limit));
      }
    } catch (e) {
      console.log("Error", e);
    } finally {
      setLoading(false);
    }
  }, [patientDetails.userDetails.userDetailsId, page, limit]);

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

  return (
    <div className="flex flex-col gap-3 group">
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
              className="invisible group-hover:visible"
            >
              <PlusCircle />
            </Button>
            <ProceduresSurgeriesAndHospitalizationDialog
              userDetailsId={patientDetails.userDetails.userDetailsId}
              procedureData={editData}
              isOpen={isDialogOpen}
              onClose={() => {
                setIsDialogOpen(false);
                fetchProcedures();
                setEditData(null);
              }}
            />
          </div>
          <AccordionContent className="sm:max-w-4xl">
            {loading ? (
              <AccordionShimmerCard />
            ) : (
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
                {data?.data &&
                  data.data.flatMap((procedure, index) => (
                    <div
                      key={index}
                      className="flex flex-col gap-2 border rounded-lg p-2"
                    >
                      <div className="flex justify-between items-center">
                        <div className="text-base font-semibold capitalize">
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
                                userDetailsId:
                                  patientDetails.userDetails.userDetailsId,
                                nameType: {
                                  id: procedure.nameType.id,
                                  createdAt: procedure.nameType.createdAt,
                                  updatedAt: procedure.nameType.createdAt,
                                  description: procedure.nameType.description,
                                  name: procedure.nameType.name,
                                },
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
                        <FormLabels
                          label="Name"
                          value={procedure.nameType.name}
                        />
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
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ProceduresSurgeriesAndHospitalization;
