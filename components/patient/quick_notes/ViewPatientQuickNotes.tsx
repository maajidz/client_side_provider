import { useToast } from "@/hooks/use-toast";
import { QuickNotesInterface } from "@/types/quickNotesInterface";
import { showToast } from "@/utils/utils";
import { columns } from "./columns";
import QuickNotesDialog from "./QuickNotesDialog";
import { useState } from "react";
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";
import TableShimmer from "@/components/custom_buttons/table/TableShimmer";

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

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditData(null);
  };

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-col gap-6">
      {loading ? (
        <TableShimmer />
      ) : (
        <DefaultDataTable
          title={"Patient Notes"}
          onAddClick={() => setIsDialogOpen(true)}
          columns={columns({
            setIsDialogOpen,
            setEditData,
            setLoading,
            showToast: ({ type, message }) => {
              showToast({
                toast,
                type: type === "success" ? "success" : "error",
                message,
              });
            },
            fetchQuickNotes: fetchQuickNotes,
          })}
          data={data || []}
          pageNo={page}
          totalPages={totalPages}
          onPageChange={(newPage: number) => setPage(newPage)}
        />
      )}

      <QuickNotesDialog
        userDetailsId={userDetailsId}
        quickNotesData={editData}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onFetchQuickNotes={fetchQuickNotes}
      />
    </div>
  );
};

export default ViewPatientQuickNotes;
