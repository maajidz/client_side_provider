import LoadingButton from "@/components/LoadingButton";
import { getSocialHistory } from "@/services/socialHistoryServices";
import { SocialHistoryInterface } from "@/types/socialHistoryInterface";
import { useCallback, useEffect, useState } from "react";

interface SocialHistoryClientProps {
  userDetailsId: string;
}

function SocialHistoryData({ userDetailsId }: SocialHistoryClientProps) {
  // Social History State
  const [socialHistory, setSocialHistory] = useState<SocialHistoryInterface[]>(
    []
  );

  // Loading State
  const [loading, setLoading] = useState(false);

  // GET Social History Data
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

  // Effects
  useEffect(() => {
    fetchSocialHistory();
  }, [fetchSocialHistory]);

  if (loading) return <LoadingButton />;

  return (
    <>
      {socialHistory.map((history) => (
        <div key={history.id} dangerouslySetInnerHTML={{ __html: history.content }} />
      ))}
    </>
  );
}

export default SocialHistoryData;
