import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  deletePastMedicalHistory,
  getPastMedicalHistory,
} from "@/services/chartDetailsServices";
import {
  PastMedicalHistoryInterface,
  PastMedicalHistoryResponseInterface,
} from "@/services/pastMedicalHistoryInterface";
import { UserEncounterData } from "@/types/chartsInterface";
import PastMedicalHistoryDialog from "./PastMedicalHistoryDialog";
import {
  EllipsisVertical,
  PlusCircle,
} from "lucide-react";
import { useEffect, useCallback, useState } from "react";
import { showToast } from "@/utils/utils";
import { useToast } from "@/hooks/use-toast";
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

interface PastMedicalHistoryProps {
  patientDetails: UserEncounterData;
}

const PastMedicalHistory = ({ patientDetails }: PastMedicalHistoryProps) => {
  // Loading State
  const [loading, setLoading] = useState(false);

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  // Data State
  const [medicalHistory, setMedicalHistory] =
    useState<PastMedicalHistoryResponseInterface>();
  const [editData, setEditData] = useState<PastMedicalHistoryInterface | null>(
    null
  );

  // Pagination State
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 3;

  const { toast } = useToast();

  // GET Past Medical History
  const fetchPastMedicalHistory = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getPastMedicalHistory({
        userDetailsId: patientDetails.userDetails.userDetailsId,
        page: page,
        limit: limit,
      });
      if (response) {
        setMedicalHistory(response);
        setTotalPages(Math.ceil(response.total / limit));
      }
    } catch (err) {
      showToast({
        toast,
        type: "error",
        message: `Error fetching supplement data: ${err}`,
      });
    } finally {
      setLoading(false);
    }
  }, [patientDetails.userDetails.userDetailsId, page, limit, toast]);

  // Effects
  useEffect(() => {
    fetchPastMedicalHistory();
  }, [fetchPastMedicalHistory]);

  const handleDeletePastMedicalHistory = async (id: string) => {
    setLoading(true);

    try {
      await deletePastMedicalHistory({ id });
      showToast({
        toast,
        type: "success",
        message: `Medical history deleted successfully`,
      });
    } catch (err) {
      if (err instanceof Error)
        showToast({
          toast,
          type: "error",
          message: `Could not delete medical history`,
        });
    } finally {
      setLoading(false);
      fetchPastMedicalHistory();
    }
  };

  // Define the columns for the past medical history table
  const columns: ColumnDef<PastMedicalHistoryInterface>[] = [
    {
      accessorKey: "notes",
      header: "Notes",
      cell: ({ row }) => (
        <div className="cursor-pointer font-semibold">
          {row.getValue("notes")}
        </div>
      ),
    },
    {
      accessorKey: "glp_refill_note_practice",
      header: "GLP Refill Note",
      cell: ({ row }) => (
        <div className="cursor-pointer text-sm text-gray-700">
          {row.getValue("glp_refill_note_practice")}
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
                  setEditData(row.original);
                  setIsDialogOpen(true);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeletePastMedicalHistory(row.original.id)}
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
        <AccordionItem value="pastMedicalHistory">
          <div className="flex justify-between items-center">
            <AccordionTrigger>Past Medical History</AccordionTrigger>
            <Button
              variant="ghost"
              onClick={() => setIsDialogOpen(true)}
              className="invisible group-hover:visible"
            >
              <PlusCircle />
            </Button>
            <PastMedicalHistoryDialog
              isOpen={isDialogOpen}
              userDetailsId={patientDetails.userDetails.userDetailsId}
              onClose={() => {
                setIsDialogOpen(false);
                fetchPastMedicalHistory();
                setEditData(null);
              }}
              selectedMedicaHistory={editData}
            />
          </div>
          <AccordionContent className="sm:max-w-4xl">
            {loading ? (
              <AccordionShimmerCard />
            ) : medicalHistory && medicalHistory.total > 0 ? (
              <div className="flex flex-col gap-2">
                <DefaultDataTable
                  title="Medical History"
                  columns={columns}
                  data={medicalHistory.items || []}
                  pageNo={page}
                  totalPages={totalPages}
                  onPageChange={(newPage) => setPage(newPage)}
                  // onAddClick={() => setIsDialogOpen(true)}
                  className="mt-4"
                />
              </div>
            ) : (
              <div className="text-center">No Medical History found!</div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default PastMedicalHistory;
