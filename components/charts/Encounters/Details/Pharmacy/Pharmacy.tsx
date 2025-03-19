import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { UserEncounterData } from "@/types/chartsInterface";
import { UserPharmacyInterface } from "@/types/pharmacyInterface";
import { deleteUserPharmacyData, getUserPharmacyData } from "@/services/chartDetailsServices";
import PharmacyDialog from "./PharmacyDialog";
import { PlusCircle, Trash2Icon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { showToast } from "@/utils/utils";
import { useToast } from "@/hooks/use-toast";
import AccordionShimmerCard from "@/components/custom_buttons/shimmer/AccordionCardShimmer";

interface PharmacyProps {
  patientDetails: UserEncounterData;
}

const Pharmacy = ({ patientDetails }: PharmacyProps) => {
  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Data States
  const [pharmacyData, setPharmacyData] = useState<UserPharmacyInterface>();

  // Loading State
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  // GET User Pharmacy
  const fetchUserPharmacy = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getUserPharmacyData({
        userDetailsId: patientDetails.userDetails.userDetailsId,
      });

      if (response) {
        setPharmacyData(response);
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
  }, [patientDetails.userDetails.userDetailsId, toast]);

  // Effects
  useEffect(() => {
    fetchUserPharmacy();
  }, [fetchUserPharmacy]);

  const handleDeleteUserPharmacy = async (pharmacyId: string) => {
    setLoading(true);

    try {
      await deleteUserPharmacyData({ pharmacyId });

      showToast({
        toast,
        type: "success",
        message: `Pharmacy deleted successfully`,
      });
    } catch (err) {
      if (err instanceof Error)
        showToast({
          toast,
          type: "error",
          message: `Pharmacy delete failed`,
        });
    } finally {
      setLoading(false);
      await fetchUserPharmacy();
    }
  };

  return (
    <div className="flex flex-col gap-3 group">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="pharmacy">
          <div className="flex justify-between items-center">
            <AccordionTrigger>Pharmacy</AccordionTrigger>
            <Button
              variant="ghost"
              onClick={() => setIsDialogOpen(true)}
              className="invisible group-hover:visible"
            >
              <PlusCircle />
            </Button>
            <PharmacyDialog
              isOpen={isDialogOpen}
              userDetailsId={patientDetails.userDetails.userDetailsId}
              onClose={() => {
                setIsDialogOpen(false);
                fetchUserPharmacy();
              }}
            />
          </div>
          <AccordionContent className="sm:max-w-4xl">
            {loading ? (
              <AccordionShimmerCard />
            ) : (
              <>
                {pharmacyData !== undefined ? (
                  <div
                    key={pharmacyData.id}
                    className="flex flex-col gap-2 border rounded-md p-2"
                  >
                    <div className="flex justify-between items-center">
                      <h5 className="text-lg font-semibold">
                        {pharmacyData?.name}
                      </h5>
                      <div className="flex items-center">
                        <Button
                          variant="ghost"
                          onClick={() => {
                            handleDeleteUserPharmacy(pharmacyData?.id);
                          }}
                          disabled={loading}
                        >
                          <Trash2Icon color="#84012A" />
                        </Button>
                      </div>
                    </div>
                    <span className="text-sm text-gray-700">
                      <span className="font-semibold">
                        {pharmacyData?.address}
                      </span>
                      {" - "}
                      <span>
                        {pharmacyData?.city}, {pharmacyData?.state},{" "}
                        {pharmacyData?.country}
                      </span>
                      {", "}
                      <span>{pharmacyData?.zipCode}</span>
                    </span>
                    <span className="text-md">{pharmacyData?.phoneNumber}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    No pharmacy data available
                  </div>
                )}
              </>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Pharmacy;
