import AlertDialog from "@/components/charts/Encounters/Details/Alerts/AlertDialog";
import LoadingButton from "@/components/LoadingButton";
import { useToast } from "@/components/ui/use-toast";
import { getAlertData } from "@/services/chartDetailsServices";
import { AlertResponseInterface } from "@/types/alertInterface";
import { showToast } from "@/utils/utils";
import { columns } from "./columns";
import React, { useCallback, useEffect, useState } from "react";
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";

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
  const [isDialogOpen, setIsDialogOpen] = useState({
    create: false,
    edit: false,
  });

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAlertData({
        userDetailsId: userDetailsId,
      });
      if (response) {
        setData(response);
        setTotalPages(response.total / limit);
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
    <div className="flex flex-col gap-6">
      <AlertDialog
        userDetailsId={userDetailsId}
        onClose={() => {
          setIsDialogOpen((prev) => ({ ...prev, create: false }));
          fetchAlerts();
        }}
        isOpen={isDialogOpen.create}
      />
      <div className="flex flex-col gap-6">
        {data?.data && (
          <DefaultDataTable
            title={"Patient Alerts"}
            onAddClick={() => {
              setIsDialogOpen((prev) => ({ ...prev, create: true }));
            }}
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
            setIsDialogOpen((prev) => ({ ...prev, edit: false }));
            fetchAlerts();
          }}
          isOpen={isDialogOpen.edit}
        />
      </div>
    </div>
  );
};

export default ViewPatientAlerts;
