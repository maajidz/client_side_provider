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
import { Edit2Icon, PlusCircle, Trash2Icon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import LoadingButton from "@/components/LoadingButton";
import { showToast } from "@/utils/utils";

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
  const [loading, setLoading] = useState(false);

  // Error State
  const [error, setError] = useState("");

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Toast State
  const { toast } = useToast();

  // GET Social History Data
  const fetchSocialHistory = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getSocialHistory({
        userDetailsId: patientDetails.userDetails.userDetailsId,
        page: 1,
        limit: 5,
      });

      if (response) {
        setSocialHistory(response.data);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  }, [patientDetails.userDetails.userDetailsId]);

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
            <Button variant="ghost" onClick={() => setIsDialogOpen(true)} className="invisible group-hover:visible">
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
            {error && (
              <div className="flex items-center justify-center">{error}</div>
            )}
            {loading ? (
              <LoadingButton />
            ) : socialHistory.length === 0 ? (
              <p className="text-center">No social history available</p>
            ) : (
              <>
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
              </>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default SocialHistory;
