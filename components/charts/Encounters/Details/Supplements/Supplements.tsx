import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  deleteSupplement,
  getSupplements,
} from "@/services/chartDetailsServices";
import { UserEncounterData } from "@/types/chartsInterface";
import {
  SupplementInterfaceResponse,
  SupplementResponseInterface,
} from "@/types/supplementsInterface";
import SupplementsDialog from "./SupplementsDialog";
import {
  ChevronLeft,
  ChevronRight,
  Edit2,
  PlusCircle,
  Trash2Icon,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import AccordionShimmerCard from "@/components/custom_buttons/shimmer/AccordionCardShimmer";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { showToast } from "@/utils/utils";

interface SupplementsProps {
  patientDetails: UserEncounterData;
}

const Supplements = ({ patientDetails }: SupplementsProps) => {
  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  // Data States
  const [supplementData, setSupplementData] =
    useState<SupplementResponseInterface>();

  // Loading State
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState<SupplementInterfaceResponse | null>(
    null
  );

  // Pagination State
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 3;

  const { toast } = useToast();

  // GET Supplements
  const fetchSupplements = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getSupplements({
        userDetailsId: patientDetails.userDetails.userDetailsId,
        page: page,
        limit: limit,
      });

      if (response) {
        setSupplementData(response);
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

  useEffect(() => {
    fetchSupplements();
  }, [fetchSupplements]);

  // DELETE Supplement
  const handleDeleteSupplement = async (supplementId: string) => {
    setLoading(true);

    try {
      await deleteSupplement(supplementId);

      showToast({
        toast,
        type: "success",
        message: `Supplement deleted successfully`,
      });
    } catch (err) {
      if (err instanceof Error)
        showToast({
          toast,
          type: "error",
          message: `Supplement deletion failed`,
        });
    } finally {
      setLoading(false);
      await fetchSupplements();
    }
  };

  return (
    <div className="flex flex-col gap-3 group">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="supplements">
          <div className="flex justify-between items-center">
            <AccordionTrigger>Supplements</AccordionTrigger>
            <Button
              variant="ghost"
              onClick={() => setIsDialogOpen(true)}
              className="invisible group-hover:visible"
            >
              <PlusCircle />
            </Button>
            <SupplementsDialog
              userDetailsId={patientDetails?.userDetails.userDetailsId}
              selectedSupplement={editData}
              onClose={() => {
                setIsDialogOpen(false);
                fetchSupplements();
              }}
              isOpen={isDialogOpen}
            />
          </div>
          <AccordionContent className="sm:max-w-4xl">
            {loading ? (
              <AccordionShimmerCard />
            ) : supplementData && supplementData.total > 0 ? (
              supplementData.data && (
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
                  {supplementData?.data.map((supplement) => (
                    <div
                      key={supplement.id}
                      className="flex flex-col gap-2 border rounded-md p-2"
                    >
                      <div className="flex justify-between items-center">
                        <h5 className="text-lg font-semibold">
                          {supplement?.type?.supplement_name}{" "}
                          <span className="text-sm text-gray-400 font-light">
                            ({supplement?.manufacturer})
                          </span>
                        </h5>
                        <div className="flex items-center">
                          <Button
                            variant={"ghost"}
                            onClick={() => {
                              setEditData(supplement);
                              setIsDialogOpen(true);
                            }}
                          >
                            <Edit2 color="#84012A" />
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() =>
                              handleDeleteSupplement(supplement.id)
                            }
                            disabled={loading}
                          >
                            <Trash2Icon color="#84012A" />
                          </Button>
                        </div>
                      </div>
                      <span className="text-sm text-gray-700">
                        <span className="font-semibold">
                          {supplement.dosage}
                        </span>{" "}
                        <span>{supplement.intake_type},</span>{" "}
                        <span className="capitalize">
                          {supplement.frequency}
                        </span>
                      </span>
                      <span className="text-md font-medium">
                        {supplement.comments}
                      </span>
                      <Badge
                        className={`w-fit px-2 py-0.5 text-md rounded-full border-[1px] ${
                          supplement.status.toLowerCase() === "active"
                            ? "bg-[#ABEFC6] text-[#067647] border-[#067647] hover:bg-[#ABEFC6]"
                            : "bg-[#FECDCA] text-[#B42318] border-[#B42318] hover:bg-[#FECDCA]"
                        }`}
                      >
                        {supplement.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="text-center">No Supplements found!</div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Supplements;
