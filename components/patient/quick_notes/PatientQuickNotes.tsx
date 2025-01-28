import { useToast } from "@/hooks/use-toast";
import { getQuickNotesData } from "@/services/quickNotesServices";
import { QuickNotesInterface } from "@/types/quickNotesInterface";
import { showToast } from "@/utils/utils";
import QuickNotesDialog from "./QuickNotesDialog";
import ViewPatientQuickNotes from "./ViewPatientQuickNotes";
import { PlusIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import DefaultButton from "@/components/custom_buttons/buttons/DefaultButton";

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

  // Fetch Quick Notes
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
      console.error("Error fetching quick notes:", e);
      // Optionally, show a toast or alert to inform the user about the error.
      showToast({
        toast,
        type: "error",
        message: "Error fetching quick notes. Please try again later.",
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
      <div className="flex justify-end">
        <DefaultButton
          onClick={() => {
            setIsDialogOpen(true);
          }}
        >
          <div className="flex gap-2">
            <PlusIcon />
            Note
          </div>
        </DefaultButton>
        <QuickNotesDialog
          userDetailsId={userDetailsId}
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
          }}
          onFetchQuickNotes={fetchQuickNotes}
        />
      </div>
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
