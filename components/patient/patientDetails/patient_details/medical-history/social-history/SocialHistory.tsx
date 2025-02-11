import SocialHistoryDialog from "@/components/charts/Encounters/Details/SocialHistory/SocialHistoryDialog";
import GhostButton from "@/components/custom_buttons/buttons/GhostButton";
import LoadingButton from "@/components/LoadingButton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SocialHistoryInterface } from "@/types/socialHistoryInterface";
import { getSocialHistory } from "@/services/socialHistoryServices";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface SocialHistoryProps {
  userDetailsId: string;
}

function SocialHistory({ userDetailsId }: SocialHistoryProps) {
  // Data State
  const [socialHistory, setSocialHistory] = useState<SocialHistoryInterface[]>(
    []
  );

  // Dialog State
  const [isOpen, setIsOpen] = useState(false);

  // Loading State
  const [loading, setLoading] = useState(false);

  // Pagination State
  const itemsPerPage = 3;
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchSocialHistory = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getSocialHistory({
        userDetailsId,
        page,
        limit: itemsPerPage,
      });

      if (response) {
        setSocialHistory(response.data);
        setTotalPages(Math.ceil(response.total / itemsPerPage));
      }
    } catch (err) {
      console.log("Error", err);
    } finally {
      setLoading(false);
    }
  }, [userDetailsId, page]);

  useEffect(() => {
    fetchSocialHistory();
  }, [fetchSocialHistory]);

  return (
    <div className="flex flex-col gap-2 mb-3">
      <div className="flex justify-between items-center p-4 text-lg font-semibold rounded-md bg-[#f0f0f0]">
        <span>Social History</span>
        <GhostButton onClick={() => setIsOpen(true)}>Add </GhostButton>
        <SocialHistoryDialog
          userDetailsId={userDetailsId}
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false);
            fetchSocialHistory();
          }}
        />
      </div>
      <ScrollArea className="h-[12.5rem] min-h-10">
        <div className="flex flex-1 flex-col p-2 border rounded-lg m-3">
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
              >
                Next
              </Button>
            </div>
          </div>
          {loading ? (
            <LoadingButton />
          ) : (
            socialHistory.map((history) => (
              <div className="flex flex-col gap-3" key={history.id}>
                <div className="font-semibold text-large">
                  Social History recorded on{" "}
                  {new Date(history.updatedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })}
                </div>
                <div
                  key={history.id}
                  dangerouslySetInnerHTML={{ __html: history.content }}
                />
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

export default SocialHistory;
