import React, { useCallback, useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  EllipsisVertical,
  PlusCircle,
} from "lucide-react";
import RecallsDialog from "./RecallsDialog";
import { UserEncounterData } from "@/types/chartsInterface";
import {
  RecallsEditData,
  RecallsResponseInterface,
} from "@/types/recallsInterface";
import { deleteRecalls, getRecallsData } from "@/services/chartDetailsServices";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
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

const Recalls = ({ patientDetails }: { patientDetails: UserEncounterData }) => {
  // Loading State
  const [loading, setLoading] = useState<boolean>(false);

  // Data State
  const [data, setData] = useState<RecallsResponseInterface>();
  const [editData, setEditData] = useState<RecallsEditData | null>(null);

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  // Pagination State
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 3;

  const { toast } = useToast();

  // Provider Details
  const providerDetails = useSelector((state: RootState) => state.login);

  // Fetch Recalls Data
  const fetchRecalls = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getRecallsData({
        page: page,
        limit: limit,
        userDetailsId: patientDetails.userDetails.userDetailsId,
        providerId: providerDetails.providerId,
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
  }, [
    patientDetails.userDetails.userDetailsId,
    providerDetails.providerId,
    page,
    limit,
  ]);

  // Effects
  useEffect(() => {
    fetchRecalls();
  }, [fetchRecalls]);

  // Delete Recall
  const handleDeleteRecall = async (recallId: string) => {
    setLoading(true);
    try {
      await deleteRecalls({ id: recallId });
      showToast({
        toast,
        type: "success",
        message: "Recalls deleted successfully",
      });
      fetchRecalls();
    } catch (e) {
      console.log("Error:", e);
      showToast({ toast, type: "error", message: "Error" });
    } finally {
      setLoading(false);
      fetchRecalls();
    }
  };

  // Define columns for the recalls table
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <div className="cursor-pointer font-semibold">
          {row.original.type}
        </div>
      ),
    },
    {
      accessorKey: "notes",
      header: "Notes",
      cell: ({ row }) => (
        <div className="cursor-pointer">
          {row.original.notes}
        </div>
      ),
    },
    {
      accessorKey: "auto_reminders",
      header: "Auto Reminders",
      cell: ({ row }) => (
        <div className="cursor-pointer">
          {row.original.auto_reminders ? "On" : "Off"}
        </div>
      ),
    },
    {
      accessorKey: "due_date",
      header: "Due Date",
      cell: ({ row }) => (
        <div className="cursor-pointer">
          {`${row.original.due_date_period} ${row.original.due_date_value} ${row.original.due_date_unit}`}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created On",
      cell: ({ row }) => (
        <div className="cursor-pointer">
          {row.original.createdAt.split("T")[0]}
        </div>
      ),
    },
    {
      accessorKey: "id",
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
                    status: row.original.status,
                    id: row.original.id,
                    type: row.original.type,
                    notes: row.original.notes,
                    providerId: row.original.providerId,
                    due_date_period: row.original.due_date_period,
                    due_date_value: row.original.due_date_value,
                    due_date_unit: row.original.due_date_unit,
                    auto_reminders: row.original.auto_reminders,
                  });
                  setIsDialogOpen(true);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteRecall(row.original.id)}
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
        <AccordionItem value="recalls">
          <div className="flex justify-between items-center">
            <AccordionTrigger>Recalls</AccordionTrigger>
            <Button
              variant="ghost"
              onClick={() => {
                setEditData(null);
                setIsDialogOpen(true);
              }}
              className="invisible group-hover:visible"
            >
              <PlusCircle />
            </Button>
            <RecallsDialog
              userDetailsId={patientDetails.userDetails.userDetailsId}
              recallsData={editData}
              onClose={() => {
                setIsDialogOpen(false);
                fetchRecalls();
                setEditData(null);
              }}
              isOpen={isDialogOpen}
            />
          </div>
          <AccordionContent>
            {loading ? (
              <AccordionShimmerCard />
            ) : (
              data?.data && (
                <div className="flex flex-col gap-2">
                  <DefaultDataTable
                    title="Recalls"
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
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Recalls;
