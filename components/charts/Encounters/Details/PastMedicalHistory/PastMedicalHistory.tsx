import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  deletePastMedicalHistory,
  getPastMedicalHistory,
} from "@/services/chartDetailsServices";
import {
  PastMedicalHistoryInterface,
  PastMedicalHistoryResponseInterface,
} from "@/services/pastMedicalHistoryInterface";
import { UserEncounterData } from "@/types/chartsInterface";
import PastMedicalHistoryDialog from "./PastMedicalHistoryDialog";
import {
  ChevronLeft,
  ChevronRight,
  Edit2,
  PlusCircle,
  Trash2Icon,
} from "lucide-react";
import { useEffect, useCallback, useState } from "react";
import { showToast } from "@/utils/utils";
import { useToast } from "@/hooks/use-toast";
import AccordionShimmerCard from "@/components/custom_buttons/shimmer/AccordionCardShimmer";

interface PastMedicalHistoryProps {
  patientDetails: UserEncounterData;
}

const PastMedicalHistory = ({ patientDetails }: PastMedicalHistoryProps) => {
  // Loading State
  const [loading, setLoading] = useState(false);

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  // Data State
  const [medicalHistory, setMedicalHistory] =
    useState<PastMedicalHistoryResponseInterface>();
  const [editData, setEditData] = useState<PastMedicalHistoryInterface | null>(
    null
  );

  // Pagination State
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 3;

  const { toast } = useToast();

  // GET Past Medical History
  const fetchPastMedicalHistory = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getPastMedicalHistory({
        userDetailsId: patientDetails.userDetails.userDetailsId,
        page: page,
        limit: limit,
      });
      if (response) {
        setMedicalHistory(response);
        setTotalPages(Math.ceil(response.total / limit));
      }
    } catch (err) {
      showToast({
        toast,
        type: "error",
        message: `Error fetching supplement data: ${err}`,
      });
    } finally {
      setLoading(false);
    }
  }, [patientDetails.userDetails.userDetailsId, page, limit, toast]);

  // Effects
  useEffect(() => {
    fetchPastMedicalHistory();
  }, [fetchPastMedicalHistory]);

  const handleDeletePastMedicalHistory = async (id: string) => {
    setLoading(true);

    try {
      await deletePastMedicalHistory({ id });
      showToast({
        toast,
        type: "success",
        message: `Medical history deleted successfully`,
      });
    } catch (err) {
      if (err instanceof Error)
        showToast({
          toast,
          type: "error",
          message: `Could not delete medical history`,
        });
    } finally {
      setLoading(false);
      fetchPastMedicalHistory();
    }
  };

  return (
    <div className="flex flex-col gap-3 group">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="pastMedicalHistory">
          <div className="flex justify-between items-center">
            <AccordionTrigger>Past Medical History</AccordionTrigger>
            <Button
              variant="ghost"
              onClick={() => setIsDialogOpen(true)}
              className="invisible group-hover:visible"
            >
              <PlusCircle />
            </Button>
            <PastMedicalHistoryDialog
              isOpen={isDialogOpen}
              userDetailsId={patientDetails.userDetails.userDetailsId}
              onClose={() => {
                setIsDialogOpen(false);
                fetchPastMedicalHistory();
                setEditData(null);
              }}
              selectedMedicaHistory={editData}
            />
          </div>
          <AccordionContent className="sm:max-w-4xl">
            {loading ? (
              <AccordionShimmerCard />
            ) : medicalHistory && medicalHistory.total > 0 ? (
              medicalHistory.items && (
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
                  {medicalHistory?.items.map((history) => (
                    <div
                      key={history.id}
                      className="flex flex-col gap-2 border rounded-md p-2"
                    >
                      <div className="flex justify-between items-center">
                        <h5 className="text-lg font-semibold">
                          {history.notes}
                        </h5>
                        <div className="flex items-center">
                          <Button
                            variant={"ghost"}
                            onClick={() => {
                              setEditData(history);
                              setIsDialogOpen(true);
                            }}
                          >
                            <Edit2 color="#84012A" />
                          </Button>
                          <Button
                            variant="ghost"
                            disabled={loading}
                            onClick={() =>
                              handleDeletePastMedicalHistory(history.id)
                            }
                          >
                            <Trash2Icon color="#84012A" />
                          </Button>
                        </div>
                      </div>
                      <span className="text-sm text-gray-700">
                        {history.glp_refill_note_practice}
                      </span>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="text-center">No Medical History found!</div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default PastMedicalHistory;
