import LoadingButton from "@/components/LoadingButton";
import { DataTable } from "@/components/ui/data-table";
import { useToast } from "@/hooks/use-toast";
import { QuickNotesInterface } from "@/types/quickNotesInterface";
import { showToast } from "@/utils/utils";
import { columns } from "./columns";
import QuickNotesDialog from "./QuickNotesDialog";
import { useState } from "react";

interface ViewPatientNotesProps {
  userDetailsId: string;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  data: QuickNotesInterface[];
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  fetchQuickNotes: () => Promise<void>;
}

const ViewPatientQuickNotes = ({
  userDetailsId,
  data,
  page,
  totalPages,
  loading,
  setPage,
  setLoading,
  fetchQuickNotes,
}: ViewPatientNotesProps) => {
  // Toast State
  const { toast } = useToast();

  // Corrected initialization of editData
  const [editData, setEditData] = useState<{
    notes: string;
    noteId: string;
  } | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  // If loading, show a loading button
  if (loading) {
    return <LoadingButton />;
  }

  return (
    <div className="py-5">
      {data && (
        <DataTable
          searchKey="id"
          columns={columns({
            setIsDialogOpen,
            setEditData,
            setLoading,
            showToast: () =>
              showToast({
                toast,
                type: "success",
                message: "Deleted Successfully",
              }),
            fetchQuickNotes: fetchQuickNotes,
          })}
          data={data}
          pageNo={page}
          totalPages={totalPages}
          onPageChange={(newPage: number) => setPage(newPage)}
        />
      )}

      <QuickNotesDialog
        userDetailsId={userDetailsId}
        quickNotesData={editData}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onFetchQuickNotes={fetchQuickNotes}
      />
    </div>
  );
};

export default ViewPatientQuickNotes;
