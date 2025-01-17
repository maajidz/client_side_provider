import React, { useCallback, useEffect, useState } from "react";
import LoadingButton from "@/components/LoadingButton";
import { getAlertData } from "@/services/chartDetailsServices";

const ViewPatientQuickNotes = ({
  userDetailsId,
}: {
  userDetailsId: string;
}) => {
  // const [page, setPage] = useState<number>(1);
  // const limit = 8;
  // const [totalPages, setTotalPages] = useState<number>(1);
  // const { toast } = useToast();

  const [loading, setLoading] = useState<boolean>(false);
  // const [data, setData] = useState<{
  //   notes: string;
  //   noteId: string;
  // }>();
  // const [editData, setEditData] = useState<{
  //   notes: string;
  //   noteId: string;
  // } | null>(null);
  // const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAlertData({
        userDetailsId: userDetailsId,
      });
      if (response) {
      //   setData(response);
      //   setTotalPages(response.total / limit);
      }
    } catch (e) {
      console.log("Error", e);
    } finally {
      setLoading(false);
    }
  }, [userDetailsId]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  if (loading) {
    return <LoadingButton />;
  }

  return (
    <>
      {/* <div className="py-5">
        {data?.data && (
          <DataTable
            searchKey="id"
            columns={columns({
              setEditData,
              setIsDialogOpen,
              setLoading,
              showToast: () =>
                showToast({
                  toast,
                  type: "success",
                  message: "Deleted Successfully",
                }),
              fetchAlerts: () => fetchAlerts(),
            })}
            data={data?.data}
            pageNo={page}
            totalPages={totalPages}
            onPageChange={(newPage: number) => setPage(newPage)}
          />
        )} */}

        {/* <QuickNotesDialog
            userDetailsId={userDetailsId}
          quickNotesData={editData}
          onClose={() => {
            setIsDialogOpen(false);
          }}
          isOpen={isDialogOpen}
        /> */}
      {/* </div> */}
    </>
  );
};

export default ViewPatientQuickNotes;
