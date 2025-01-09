import LoadingButton from "@/components/LoadingButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  deleteSupplement,
  getSupplements,
} from "@/services/chartDetailsServices";
import { UserEncounterData } from "@/types/chartsInterface";
import { SupplementInterface } from "@/types/supplementsInterface";
import { showToast } from "@/utils/utils";
import { Trash2Icon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import EditSupplement from "./EditSupplement";

interface SupplementListProps {
  patientDetails: UserEncounterData;
}

function SupplementList({ patientDetails }: SupplementListProps) {
  // Data States
  const [supplementData, setSupplementData] = useState<SupplementInterface[]>();

  // Loading State
  const [loading, setLoading] = useState(false);

  // Error State
  const [error, setError] = useState("");

  // Toast State
  const { toast } = useToast();

  // GET Supplements
  const fetchSupplements = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getSupplements({userDetailsId: patientDetails.userDetails.id});

      if (response) {
        setSupplementData(response.data);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError("Something went wrong");
      } else {
        setError("Something went wrong. Unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }, [patientDetails.userDetails.id]);

  // Effects
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
      fetchSupplements();
    }
  };

  if (loading) return <LoadingButton />;

  if (error)
    return <div className="flex items-center justify-center">{error}</div>;

  return (
    <>
      {supplementData && supplementData.length > 0 ? (
        supplementData.map((supplement) => (
          <div
            key={supplement.id}
            className="flex flex-col gap-2 border rounded-md p-2"
          >
            <div className="flex justify-between items-center">
              <h5 className="text-lg font-semibold">
                {supplement?.supplement}{" "}
                <span className="text-sm text-gray-400 font-light">
                  ({supplement?.manufacturer})
                </span>
              </h5>
              <div className="flex items-center">
                <EditSupplement
                  selectedSupplement={supplement}
                  patientDetails={patientDetails}
                  fetchSupplements={fetchSupplements}
                />
                <Button
                  variant="ghost"
                  onClick={() => handleDeleteSupplement(supplement.id)}
                  disabled={loading}
                >
                  <Trash2Icon color="#84012A" />
                </Button>
              </div>
            </div>
            <span className="text-sm text-gray-700">
              <span className="font-semibold">{supplement.dosage}</span>{" "}
              <span>{supplement.intake_type},</span>{" "}
              <span className="capitalize">{supplement.frequency}</span>
            </span>
            <span className="text-md font-medium">{supplement.comments}</span>
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
        ))
      ) : (
        <div className="flex items-center justify-center">
          No supplement data available
        </div>
      )}
    </>
  );
}

export default SupplementList;

