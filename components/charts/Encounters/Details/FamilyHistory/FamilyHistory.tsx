import React, { useCallback, useEffect, useState } from "react";
import FamilyHistoryDialog from "./FamilyHistoryDialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { UserEncounterData } from "@/types/chartsInterface";
import {
  deleteFamilyHistory,
  getFamilyHistoryData,
} from "@/services/chartDetailsServices";
import {
  EditFamilyHistoryInterface,
  FamilyHistoryResponseInterface,
} from "@/types/familyHistoryInterface";
import { Button } from "@/components/ui/button";
import { EllipsisVertical, PlusCircle } from "lucide-react";
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

const FamilyHistory = ({
  patientDetails,
}: {
  patientDetails: UserEncounterData;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<FamilyHistoryResponseInterface[]>([]);
  const [editData, setEditData] = useState<EditFamilyHistoryInterface | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  // Pagination State
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 3;

  const { toast } = useToast();

  const fetchFamilyHistory = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getFamilyHistoryData({
        limit: limit,
        page: page,
        userDetailsId: patientDetails.userDetails.userDetailsId,
      });
      if (response) {
        setData(response);
        setTotalPages(Math.ceil(response.length / limit));
      }
    } catch (e) {
      console.log("Error", e);
    } finally {
      setLoading(false);
    }
  }, [patientDetails?.userDetails.userDetailsId, page, limit]);

  useEffect(() => {
    fetchFamilyHistory();
  }, [fetchFamilyHistory]);

  const handleDeleteFamilyHistory = async (familyHistroryId: string) => {
    setLoading(true);
    try {
      await deleteFamilyHistory({ familyHistoryId: familyHistroryId });
      showToast({
        toast,
        type: "success",
        message: "Family history deleted successfully",
      });
      fetchFamilyHistory();
    } catch (e) {
      console.log("Error:", e);
      showToast({ toast, type: "error", message: "Error deleting family history" });
    } finally {
      setLoading(false);
    }
  };

  // Define the columns for the family history table
  const columns: ColumnDef<FamilyHistoryResponseInterface>[] = [
    {
      accessorKey: "relationship",
      header: "Relationship",
      cell: ({ row }) => (
        <div className="cursor-pointer font-semibold">
          {row.getValue("relationship")}
        </div>
      ),
    },
    {
      accessorKey: "age",
      header: "Age",
      cell: ({ row }) => (
        <div className="cursor-pointer">
          {row.getValue("age")}
        </div>
      ),
    },
    {
      accessorKey: "activeProblems",
      header: "Active Problems",
      cell: ({ row }) => (
        <div className="cursor-pointer">
          {row.original.activeProblems.map((problem) => (
            <div key={problem.id}>{problem.name}</div>
          ))}
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
                    relationship: row.original.relationship,
                    deceased: row.original.deceased,
                    age: row.original.age,
                    comments: row.original.comments,
                    activeProblems: row.original.activeProblems?.map(
                      (problemName) => ({
                        name: problemName.name,
                        addtionaltext: "",
                      })
                    ),
                    id: row.original.id,
                  });
                  setIsDialogOpen(true);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteFamilyHistory(row.original.id)}
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
        <AccordionItem value="familyHistory">
          <div className="flex justify-between items-center">
            <AccordionTrigger>Family History</AccordionTrigger>
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
            <FamilyHistoryDialog
              userDetailsId={patientDetails.userDetails.userDetailsId}
              familyHistoryData={editData}
              onClose={() => {
                setIsDialogOpen(false);
                fetchFamilyHistory();
                setEditData(null);
              }}
              isOpen={isDialogOpen}
            />
          </div>
          <AccordionContent className="sm:max-w-4xl">
            {loading ? (
              <AccordionShimmerCard />
            ) : (
              <div className="flex flex-col gap-2">
                {data && data.length > 0 ? (
                  <DefaultDataTable
                    title="Family History"
                    columns={columns}
                    data={data}
                    pageNo={page}
                    totalPages={totalPages}
                    onPageChange={(newPage) => setPage(newPage)}
                    // onAddClick={() => {
                    //   setEditData(null);
                    //   setIsDialogOpen(true);
                    // }}
                    className="mt-4"
                  />
                ) : (
                  <p className="text-center">No family history found</p>
                )}
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default FamilyHistory;
