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
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";
import { columns } from "@/components/patient/medications/PatientSupplements/columns";

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

  // Dialog state for columns
  const [dialogState, setDialogState] = useState<{
    create: boolean;
    edit: boolean;
  }>({ create: false, edit: false });

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

  useEffect(() => {
    if (dialogState.edit && editData) {
      setIsDialogOpen(true);
    }
  }, [dialogState.edit, editData]);

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
                setEditData(null);
                setDialogState({ create: false, edit: false });
                fetchSupplements();
              }}
              isOpen={isDialogOpen}
            />
          </div>
          <AccordionContent className="sm:max-w-4xl">
            {loading ? (
              <AccordionShimmerCard />
            ) : (
              <div className="flex flex-col gap-2">
                {supplementData?.data && supplementData.data.length > 0 ? (
                  <DefaultDataTable
                    title="Supplements"
                    columns={columns({
                      setEditData,
                      setIsDialogOpen: setDialogState,
                      setLoading,
                      showToast: ({ type, message }: { type: string; message: string }) => 
                        showToast({ toast, type: type as "success" | "error", message }),
                      fetchSupplementsList: fetchSupplements,
                      userDetailsId: patientDetails.userDetails.userDetailsId,
                    })}
                    data={supplementData.data}
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
                  <div className="text-center">No Supplements found!</div>
                )}
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Supplements;
