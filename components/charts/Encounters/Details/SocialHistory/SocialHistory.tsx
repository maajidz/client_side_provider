import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  deleteSocialHistory,
  getSocialHistory,
} from "@/services/socialHistoryServices";
import { UserEncounterData } from "@/types/chartsInterface";
import { SocialHistoryInterface } from "@/types/socialHistoryInterface";
import SocialHistoryDialog from "./SocialHistoryDialog";
import {
  ChevronLeft,
  ChevronRight,
  Edit2Icon,
  PlusCircle,
  Trash2Icon,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { showToast } from "@/utils/utils";
import AccordionShimmerCard from "@/components/custom_buttons/shimmer/AccordionCardShimmer";

interface SocialHistoryProps {
  patientDetails: UserEncounterData;
}

const SocialHistory = ({ patientDetails }: SocialHistoryProps) => {
  // Social History State
  const [socialHistory, setSocialHistory] = useState<SocialHistoryInterface[]>(
    []
  );

  // Update Social History State
  const [editData, setEditData] = useState<SocialHistoryInterface | null>(null);

  // Loading State
  const [loading, setLoading] = useState<boolean>(false);

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  // Pagination State
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 3;

  // Toast State
  const { toast } = useToast();

  // GET Social History Data
  const fetchSocialHistory = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getSocialHistory({
        userDetailsId: patientDetails.userDetails.userDetailsId,
        page: page,
        limit: limit,
      });

      if (response) {
        setSocialHistory(response.data);
        setTotalPages(Math.ceil(response.total / limit));
      }
    } catch (err) {
      showToast({
        toast,
        type: "error",
        message: `Error fetching social history data: ${err}`,
      });
    } finally {
      setLoading(false);
    }
  }, [patientDetails.userDetails.userDetailsId, page, limit, toast]);

  // DELETE Social History
  const handleDeleteSocialHistory = async (id: string) => {
    setLoading(true);

    try {
      await deleteSocialHistory({ id });

      showToast({
        toast,
        type: "success",
        message: "Social history deleted successfully",
      });
    } catch (err) {
      if (err instanceof Error) {
        showToast({
          toast,
          type: "error",
          message: "Could not delete social history",
        });
      } else {
        showToast({
          toast,
          type: "error",
          message: "Could not delete social history. An unknown error occurred",
        });
      }
    } finally {
      setLoading(false);
      fetchSocialHistory();
    }
  };

  // Effects
  useEffect(() => {
    fetchSocialHistory();
  }, [fetchSocialHistory]);

  return (
    <div className="flex flex-col gap-3 group">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="socialHistory">
          <div className="flex justify-between items-center">
            <AccordionTrigger>Social History</AccordionTrigger>
            <Button
              variant="ghost"
              onClick={() => setIsDialogOpen(true)}
              className="invisible group-hover:visible"
            >
              <PlusCircle />
            </Button>
            <SocialHistoryDialog
              isOpen={isDialogOpen}
              userDetailsId={patientDetails.userDetails.userDetailsId}
              socialHistoryData={editData}
              onClose={() => {
                setEditData(null);
                setIsDialogOpen(false);
                fetchSocialHistory();
              }}
            />
          </div>
          <AccordionContent className="sm:max-w-4xl">
            {loading ? (
              <AccordionShimmerCard />
            ) : socialHistory.length === 0 ? (
              <p className="text-center">No social history available</p>
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
                {socialHistory.map((history) => (
                  <div
                    key={history.id}
                    className="flex justify-between rounded-md"
                  >
                    <div
                      dangerouslySetInnerHTML={{ __html: history.content }}
                    />
                    <div className="flex">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setEditData({
                            id: history.id,
                            content: history.content,
                            userDetailsId: history.userDetailsId,
                            providerId: history.providerId,
                            createdAt: history.createdAt,
                            updatedAt: history.updatedAt,
                          });
                          setIsDialogOpen(true);
                        }}
                        disabled={loading}
                      >
                        <Edit2Icon color="#84012A" />
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleDeleteSocialHistory(history.id)}
                        disabled={loading}
                      >
                        <Trash2Icon color="#84012A" />
                      </Button>
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

export default SocialHistory;
