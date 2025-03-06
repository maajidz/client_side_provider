import { useToast } from "@/hooks/use-toast";
import { getQuickNotesData } from "@/services/quickNotesServices";
import { QuickNotesInterface } from "@/types/quickNotesInterface";
import { showToast } from "@/utils/utils";
import QuickNotesDialog from "./QuickNotesDialog";
import ViewPatientQuickNotes from "./ViewPatientQuickNotes";
import { useCallback, useEffect, useState } from "react";

const PatientQuickNotes = ({ userDetailsId }: { userDetailsId: string }) => {
  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  // Data State
  const [data, setData] = useState<QuickNotesInterface[]>([]);

  // Loading State
  const [loading, setLoading] = useState<boolean>(false);

  // Pagination State
  const limit = 8;
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Toast State
  const { toast } = useToast();

  // Fetch Notes
  const fetchQuickNotes = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getQuickNotesData();
      if (response) {
        setData(response.data);
        // Use Math.ceil to handle partial pages
        setTotalPages(Math.ceil(response.total / limit));
      }
    } catch (e) {
      console.error("Error fetching notes:", e);
      // Optionally, show a toast or alert to inform the user about the error.
      showToast({
        toast,
        type: "error",
        message: "Error fetching notes. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  }, [limit, toast]);

  // Fetch data when component mounts
  useEffect(() => {
    fetchQuickNotes();
  }, [fetchQuickNotes]);

  return (
    <>
      <QuickNotesDialog
        userDetailsId={userDetailsId}
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
        }}
        onFetchQuickNotes={fetchQuickNotes}
      />
      <ViewPatientQuickNotes
        userDetailsId={userDetailsId}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        data={data}
        loading={loading}
        setLoading={setLoading}
        fetchQuickNotes={fetchQuickNotes}
      />
    </>
  );
};

export default PatientQuickNotes;
