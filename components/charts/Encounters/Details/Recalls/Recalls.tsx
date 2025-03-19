import React, { useCallback, useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  ChevronLeft,
  ChevronRight,
  Edit2,
  PlusCircle,
  Trash2Icon,
} from "lucide-react";
import RecallsDialog from "./RecallsDialog";
import { UserEncounterData } from "@/types/chartsInterface";
import {
  RecallsEditData,
  RecallsResponseInterface,
} from "@/types/recallsInterface";
import { deleteRecalls, getRecallsData } from "@/services/chartDetailsServices";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import FormLabels from "@/components/custom_buttons/FormLabels";
import { showToast } from "@/utils/utils";
import AccordionShimmerCard from "@/components/custom_buttons/shimmer/AccordionCardShimmer";

const Recalls = ({ patientDetails }: { patientDetails: UserEncounterData }) => {
  // Loading State
  const [loading, setLoading] = useState<boolean>(false);

  // Data State
  const [data, setData] = useState<RecallsResponseInterface>();
  const [editData, setEditData] = useState<RecallsEditData | null>(null);

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  // Pagination State
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 3;

  const { toast } = useToast();

  // Provider Details
  const providerDetails = useSelector((state: RootState) => state.login);

  // Fetch Recalls Data
  const fetchRecalls = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getRecallsData({
        page: page,
        limit: limit,
        userDetailsId: patientDetails.userDetails.userDetailsId,
        providerId: providerDetails.providerId,
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
  }, [
    patientDetails.userDetails.userDetailsId,
    providerDetails.providerId,
    page,
    limit,
  ]);

  // Effects
  useEffect(() => {
    fetchRecalls();
  }, [fetchRecalls]);

  // Delete Recall
  const handleDeleteRecall = async (recallId: string) => {
    setLoading(true);
    try {
      await deleteRecalls({ id: recallId });
      showToast({
        toast,
        type: "success",
        message: "Recalls  deleted successfully",
      });
      fetchRecalls();
    } catch (e) {
      console.log("Error:", e);
      showToast({ toast, type: "error", message: "Error" });
    } finally {
      setLoading(false);
      fetchRecalls();
    }
  };

  return (
    <div className="flex flex-col gap-3 group">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="recalls">
          <div className="flex justify-between items-center">
            <AccordionTrigger>Recalls</AccordionTrigger>
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
            <RecallsDialog
              userDetailsId={patientDetails.userDetails.userDetailsId}
              recallsData={editData}
              onClose={() => {
                setIsDialogOpen(false);
                fetchRecalls();
                setEditData(null);
              }}
              isOpen={isDialogOpen}
            />
          </div>
          <AccordionContent>
            {loading ? (
              <AccordionShimmerCard />
            ) : (
              data?.data && (
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
                  {data.data.flatMap((recall, index) => (
                    <div
                      key={index}
                      className="flex flex-col gap-2 border rounded-lg p-2"
                    >
                      <div className="flex justify-between items-center">
                        <div className="text-base font-semibold">
                          {recall.type}{" "}
                        </div>
                        <div className="flex">
                          <Button
                            variant={"ghost"}
                            onClick={() => {
                              setEditData({
                                status: recall.status,
                                id: recall.id,
                                type: recall.type,
                                notes: recall.notes,
                                providerId: recall.providerId,
                                due_date_period: recall.due_date_period,
                                due_date_value: recall.due_date_value,
                                due_date_unit: recall.due_date_unit,
                                auto_reminders: recall.auto_reminders,
                              });
                              setIsDialogOpen(true);
                            }}
                          >
                            <Edit2 color="#84012A" />
                          </Button>
                          <Button
                            variant={"ghost"}
                            onClick={() => handleDeleteRecall(recall.id)}
                          >
                            <Trash2Icon color="#84012A" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 ">
                        <FormLabels label="Notes" value={recall.notes} />
                        <FormLabels
                          label="Auto reminders"
                          value={recall.auto_reminders ? "On" : "Off"}
                        />
                        <FormLabels
                          label="Due date"
                          value={`${recall.due_date_period} ${recall.due_date_value} ${recall.due_date_unit}`}
                        />
                        <FormLabels
                          label="Created on"
                          value={recall.createdAt.split("T")[0]}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Recalls;
