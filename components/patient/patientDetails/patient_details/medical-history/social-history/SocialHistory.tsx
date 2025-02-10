import SocialHistoryDialog from "@/components/charts/Encounters/Details/SocialHistory/SocialHistoryDialog";
import GhostButton from "@/components/custom_buttons/buttons/GhostButton";
import LoadingButton from "@/components/LoadingButton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SocialHistoryInterface } from "@/types/socialHistoryInterface";
import { getSocialHistory } from "@/services/socialHistoryServices";
import { useCallback, useEffect, useState } from "react";

interface SocialHistoryProps {
  userDetailsId: string;
}

function SocialHistory({ userDetailsId }: SocialHistoryProps) {
  // Dialog State
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialHistory, setSocialHistory] = useState<SocialHistoryInterface[]>(
    []
  );

  const fetchSocialHistory = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getSocialHistory({ userDetailsId });

      if (response) {
        setSocialHistory(response.data);
      }
    } catch (err) {
      console.log("Error", err);
    } finally {
      setLoading(false);
    }
  }, [userDetailsId]);

  useEffect(() => {
    fetchSocialHistory();
  }, [fetchSocialHistory]);

  if (loading) {
    return <LoadingButton />;
  }

  return (
    <div className="flex flex-col gap-2 mb-3">
      <div className="flex justify-between items-center p-4 text-lg font-semibold rounded-md bg-[#f0f0f0]">
        <span>Social History</span>
        <GhostButton onClick={() => setIsOpen(true)}>Add </GhostButton>
        <SocialHistoryDialog
          userDetailsId={userDetailsId}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </div>
      <ScrollArea className="h-[12.5rem] min-h-10">
        <div className="flex flex-1 flex-col p-3 border rounded-lg m-3">
          {socialHistory.map((history) => (
            <div className="flex flex-col gap-3" key={history.id}>
              <div className="font-semibold text-large">
                Social History recorded on{" "}
                {new Date(history.updatedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })}{" "}
              </div>
              <div
                key={history.id}
                dangerouslySetInnerHTML={{ __html: history.content }}
              />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

export default SocialHistory;
