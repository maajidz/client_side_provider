import React, { useCallback, useEffect, useState } from "react";
import LoadingButton from "@/components/LoadingButton";
import { DataTable } from "@/components/ui/data-table";
import { getQuickNotesData } from "@/services/quickNotesServices";
import { QuickNotesInterface } from "@/types/quickNotesInterface";
import { showToast } from "@/utils/utils";
import { useToast } from "@/hooks/use-toast";
import { columns } from "./columns";

const ViewPatientQuickNotes = ({
  userDetailsId,
}: {
  userDetailsId: string;
}) => {
  const [page, setPage] = useState<number>(1);
  const limit = 8;
  const [totalPages, setTotalPages] = useState<number>(1);
  const { toast } = useToast();

  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<QuickNotesInterface[]>([]);

  // Corrected initialization of editData
  // const [editData, setEditData] = useState<{
  //   data: {
  //     notes: string;
  //     noteId: string;
  //   } | null;
  // }>({ data: { noteId: "", notes: "" } });

  const [isDialogOpen] = useState<boolean>(false);
  console.log(isDialogOpen);

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
  }, [userDetailsId, limit, toast]);

  // Fetch data when component mounts or userDetailsId changes
  useEffect(() => {
    fetchQuickNotes();
  }, [fetchQuickNotes]);

  // If loading, show a loading button
  if (loading) {
    return <LoadingButton />;
  }

  return (
    <>
      <div className="py-5">
        {data && (
          <DataTable
            searchKey="id"
            columns={columns({
              // setIsDialogOpen,
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

        {/* Uncomment the QuickNotesDialog below if you plan to use it */}
        {/* 
        <QuickNotesDialog
          userDetailsId={userDetailsId}
          quickNotesData={editData}
          onClose={() => setIsDialogOpen(false)}
          isOpen={isDialogOpen}
        />
        */}
      </div>
    </>
  );
};

export default ViewPatientQuickNotes;
