import React, { useCallback, useEffect, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import LoadingButton from "@/components/LoadingButton";
import { getAlertData } from "@/services/chartDetailsServices";
import { showToast } from "@/utils/utils";
import { useToast } from "@/hooks/use-toast";
import { AlertResponseInterface } from "@/types/alertInterface";
import AlertDialog from "@/components/charts/Encounters/Details/Alerts/AlertDialog";

const ViewPatientAlerts = ({ userDetailsId }: { userDetailsId: string }) => {
  const [page, setPage] = useState<number>(1);
  const limit = 8;
  const [totalPages, setTotalPages] = useState<number>(1);
  const { toast } = useToast();

  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<AlertResponseInterface>();
  const [editData, setEditData] = useState<{
    alertName: string;
    alertDescription: string;
    alertId: string;
  } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAlertData({
        userDetailsId: userDetailsId,
      });
      if (response) {
        setData(response);
        setTotalPages(response.total /limit);
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
      <div className="py-5">
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
        )}

        <AlertDialog
          userDetailsId={userDetailsId}
          alertData={editData}
          onClose={() => {
            setIsDialogOpen(false);
          }}
          isOpen={isDialogOpen}
        />
      </div>
    </>
  );
};

export default ViewPatientAlerts;
