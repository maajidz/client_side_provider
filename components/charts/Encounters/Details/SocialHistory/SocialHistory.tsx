import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  deleteSocialHistory,
  getSocialHistory,
} from "@/services/socialHistoryServices";
import { UserEncounterData } from "@/types/chartsInterface";
import { SocialHistoryInterface } from "@/types/socialHistoryInterface";
import SocialHistoryDialog from "./SocialHistoryDialog";
import {
  EllipsisVertical,
  PlusCircle,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
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

interface SocialHistoryProps {
  patientDetails: UserEncounterData;
}

const SocialHistory = ({ patientDetails }: SocialHistoryProps) => {
  // Social History State
  const [socialHistory, setSocialHistory] = useState<SocialHistoryInterface[]>(
    []
  );

  // Update Social History State
  const [editData, setEditData] = useState<SocialHistoryInterface | null>(null);

  // Loading State
  const [loading, setLoading] = useState<boolean>(false);

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  // Pagination State
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 3;

  // Toast State
  const { toast } = useToast();

  // GET Social History Data
  const fetchSocialHistory = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getSocialHistory({
        userDetailsId: patientDetails.userDetails.userDetailsId,
        page: page,
        limit: limit,
      });

      if (response) {
        setSocialHistory(response.data);
        setTotalPages(Math.ceil(response.total / limit));
      }
    } catch (err) {
      showToast({
        toast,
        type: "error",
        message: `Error fetching social history data: ${err}`,
      });
    } finally {
      setLoading(false);
    }
  }, [patientDetails.userDetails.userDetailsId, page, limit, toast]);

  // DELETE Social History
  const handleDeleteSocialHistory = async (id: string) => {
    setLoading(true);

    try {
      await deleteSocialHistory({ id });

      showToast({
        toast,
        type: "success",
        message: "Social history deleted successfully",
      });
    } catch (err) {
      if (err instanceof Error) {
        showToast({
          toast,
          type: "error",
          message: "Could not delete social history",
        });
      } else {
        showToast({
          toast,
          type: "error",
          message: "Could not delete social history. An unknown error occurred",
        });
      }
    } finally {
      setLoading(false);
      fetchSocialHistory();
    }
  };

  // Define the columns for the social history table
  const columns: ColumnDef<SocialHistoryInterface>[] = [
    {
      accessorKey: "content",
      header: "Social History",
      cell: ({ row }) => (
        <div 
          className="cursor-pointer"
          dangerouslySetInnerHTML={{ __html: row.original.content }}
        />
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
                    id: row.original.id,
                    content: row.original.content,
                    userDetailsId: row.original.userDetailsId,
                    providerId: row.original.providerId,
                    createdAt: row.original.createdAt,
                    updatedAt: row.original.updatedAt,
                  });
                  setIsDialogOpen(true);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteSocialHistory(row.original.id)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  // Effects
  useEffect(() => {
    fetchSocialHistory();
  }, [fetchSocialHistory]);

  return (
    <div className="flex flex-col gap-3 group">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="socialHistory">
          <div className="flex justify-between items-center">
            <AccordionTrigger>Social History</AccordionTrigger>
            <Button
              variant="ghost"
              onClick={() => setIsDialogOpen(true)}
              className="invisible group-hover:visible"
            >
              <PlusCircle />
            </Button>
            <SocialHistoryDialog
              isOpen={isDialogOpen}
              userDetailsId={patientDetails.userDetails.userDetailsId}
              socialHistoryData={editData}
              onClose={() => {
                setEditData(null);
                setIsDialogOpen(false);
                fetchSocialHistory();
              }}
            />
          </div>
          <AccordionContent className="sm:max-w-4xl">
            {loading ? (
              <AccordionShimmerCard />
            ) : socialHistory.length === 0 ? (
              <p className="text-center">No social history available</p>
            ) : (
              <div className="flex flex-col gap-2">
                <DefaultDataTable
                  title="Social History"
                  columns={columns}
                  data={socialHistory}
                  pageNo={page}
                  totalPages={totalPages}
                  onPageChange={(newPage) => setPage(newPage)}
                  // onAddClick={() => {
                  //   setEditData(null);
                  //   setIsDialogOpen(true);
                  // }}
                  className="mt-4"
                />
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default SocialHistory;
