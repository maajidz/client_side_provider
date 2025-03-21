import React, { useCallback, useEffect, useState } from "react";
import AlertDialog from "./AlertDialog";
import { UserEncounterData } from "@/types/chartsInterface";
import { deleteAlert, getAlertData } from "@/services/chartDetailsServices";
import { AlertResponseInterface } from "@/types/alertInterface";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  EllipsisVertical,
  PlusCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { showToast } from "@/utils/utils";
import AccordionShimmerCard from "@/components/custom_buttons/shimmer/AccordionCardShimmer";
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  // Define columns for the alerts table
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "alert.alertType.alertName",
      header: "Alert Name",
      cell: ({ row }) => (
        <div className="cursor-pointer font-semibold">
          {row.original.alert.alertType.alertName}
        </div>
      ),
    },
    {
      accessorKey: "alert.alertDescription",
      header: "Description",
      cell: ({ row }) => (
        <div className="cursor-pointer">
          {row.original.alert.alertDescription}
        </div>
      ),
    },
    {
      accessorKey: "alert.alertType.notes",
      header: "Notes",
      cell: ({ row }) => (
        <div className="cursor-pointer">
          {row.original.alert.alertType.notes}
        </div>
      ),
    },
    {
      accessorKey: "alert.alertType.createdAt",
      header: "Created On",
      cell: ({ row }) => (
        <div className="cursor-pointer">
          {row.original.alert.alertType.createdAt.split("T")[0]}
        </div>
      ),
    },
    {
      accessorKey: "alert.id",
      header: "",
      cell: ({ row }) => (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <EllipsisVertical size={16} className="text-gray-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setEditData({
                    alertName: row.original.alert.alertType.alertName,
                    alertDescription: row.original.alert.alertDescription,
                    alertId: row.original.alert.id,
                  });
                  setIsDialogOpen(true);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteAlert(row.original.alert.id)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

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
                setEditData(null);
                fetchAlerts();
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
                  <DefaultDataTable
                    title="Alerts"
                    columns={columns}
                    data={data.data}
                    pageNo={page}
                    totalPages={totalPages}
                    onPageChange={(newPage) => setPage(newPage)}
                    onAddClick={() => {
                      setEditData(null);
                      setIsDialogOpen(true);
                    }}
                    className="mt-4"
                  />
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
