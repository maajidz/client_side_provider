import React, { useCallback, useEffect, useState } from "react";
import AlertDialog from "./AlertDialog";
import { UserEncounterData } from "@/types/chartsInterface";
import { deleteAlert, getAlertData } from "@/services/chartDetailsServices";
import { AlertResponseInterface } from "@/types/alertInterface";
import FormLabels from "@/components/custom_buttons/FormLabels";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ChevronLeft,
  ChevronRight,
  Edit2,
  PlusCircle,
  Trash2Icon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { showToast } from "@/utils/utils";
import AccordionShimmerCard from "@/components/custom_buttons/shimmer/AccordionCardShimmer";

const Alerts = ({ patientDetails }: { patientDetails: UserEncounterData }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<AlertResponseInterface>();
  const [editData, setEditData] = useState<{
    alertName: string;
    alertDescription: string;
    alertId: string;
  } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  // Pagination State
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 3;

  const { toast } = useToast();

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAlertData({
        userDetailsId: patientDetails.userDetails.userDetailsId,
        page: page,
        limit: limit,
      });
      if (response) {
        setData(response);
        setTotalPages(Math.ceil(response.total / limit));
      }
    } catch (e) {
      console.log("Error", e);
    } finally {
      setLoading(false);
    }
  }, [patientDetails.userDetails.userDetailsId, page, limit]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const handleDeleteAlert = async (alertId: string) => {
    setLoading(true);
    try {
      await deleteAlert({ id: alertId });
      showToast({
        toast,
        type: "success",
        message: `Alert deleted successfully`,
      });
      fetchAlerts();
    } catch (e) {
      showToast({ toast, type: "error", message: `Error` });
      console.log("Error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 group">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="alerts">
          <div className="flex justify-between items-center">
            <AccordionTrigger>Alerts</AccordionTrigger>
            <Button
              variant="ghost"
              className="px-2 invisible group-hover:visible"
              onClick={() => {
                setEditData(null);
                setIsDialogOpen(true);
              }}
            >
              <PlusCircle />
            </Button>
            <AlertDialog
              userDetailsId={patientDetails.userDetails.userDetailsId}
              alertData={editData}
              onClose={() => {
                setIsDialogOpen(false);
                fetchAlerts();
                setEditData(null);
              }}
              isOpen={isDialogOpen}
            />
          </div>
          <AccordionContent>
            {loading ? (
              <AccordionShimmerCard />
            ) : (data?.total ?? 0) > 0 ? (
              data?.data && (
                <div className="flex flex-col gap-2">
                  <div className="space-x-2 self-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page - 1)}
                      disabled={page <= 1}
                    >
                      <ChevronLeft />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={page >= totalPages}
                    >
                      <ChevronRight />
                    </Button>
                  </div>
                  {data.data.flatMap((alert, index) => (
                    <div
                      key={index}
                      className="flex flex-col gap-2 border p-2 rounded-lg"
                    >
                      <div className="flex justify-between items-center">
                        <div className="text-base font-semibold">
                          {alert.alert.alertType.alertName}{" "}
                        </div>
                        <div className="flex">
                          <Button
                            variant={"ghost"}
                            onClick={() => {
                              setEditData({
                                alertName: alert.alert.alertType.alertName,
                                alertDescription: alert.alert.alertDescription,
                                alertId: alert.alert.id,
                              });
                              setIsDialogOpen(true);
                            }}
                          >
                            <Edit2 color="#84012A" />
                          </Button>
                          <Button
                            variant={"ghost"}
                            onClick={() => handleDeleteAlert(alert.alert.id)}
                          >
                            <Trash2Icon color="#84012A" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 ">
                        <FormLabels
                          label="Description"
                          value={alert.alert.alertDescription}
                        />
                        <FormLabels
                          label="Notes"
                          value={alert.alert.alertType.notes}
                        />
                        <FormLabels
                          label="Created on"
                          value={alert.alert.alertType.createdAt.split("T")[0]}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="text-center">No Alerts found!</div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Alerts;
