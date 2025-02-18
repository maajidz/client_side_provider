import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { deleteUserPharmacyData } from "@/services/chartDetailsServices";
import { UserPharmacyInterface } from "@/types/pharmacyInterface";
import { showToast } from "@/utils/utils";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";

interface PharmacyListProps {
  error: string;
  isLoading: boolean;
  pharmacyData: UserPharmacyInterface | undefined;
  fetchUserPharmacy: () => Promise<void>;
}

function PharmacyList({
  error,
  isLoading,
  pharmacyData,
  fetchUserPharmacy,
}: PharmacyListProps) {
  // Loading State
  const [loading, setLoading] = useState(false);

  // Toast State
  const { toast } = useToast();

  // DELETE User Pharmacy
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

  if (loading || isLoading) return <LoadingButton />;

  if (error)
    return <div className="flex items-center justify-center">{error}</div>;

  return (
    <>
      {pharmacyData !== undefined ? (
        <div
          key={pharmacyData.id}
          className="flex flex-col gap-2 border rounded-md p-2"
        >
          <div className="flex justify-between items-center">
            <h5 className="text-lg font-semibold">{pharmacyData?.name}</h5>
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
            <span className="font-semibold">{pharmacyData?.address}</span>
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
  );
}

export default PharmacyList;
