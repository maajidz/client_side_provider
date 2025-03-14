import React from "react";
import { deleteInjection, getInjection } from "@/services/injectionsServices";
import {
  InjectionsData,
  InjectionsResponse,
} from "@/types/injectionsInterface";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import FormLabels from "@/components/custom_buttons/FormLabels";
import { Edit2Icon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showToast } from "@/utils/utils";
import { Badge } from "@/components/ui/badge";
import InjectionsDialog from "@/components/charts/Encounters/Details/Injections/InjectionsDialog";
import DataListShimmer from "@/components/custom_buttons/shimmer/DataListShimmer";

const ViewInjections = ({ userDetailsId }: { userDetailsId: string }) => {
  const [editData, setEditData] = useState<InjectionsData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  // Data State
  const [injectionsData, setInjectionsData] = useState<InjectionsResponse>();

  // Loading State
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // GET Injections Data
  const fetchInjectionsData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getInjection({
        page: 1,
        limit: 10,
        userDetailsId: userDetailsId,
      });

      if (response) {
        setInjectionsData(response);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [userDetailsId]);

  // Effects
  useEffect(() => {
    fetchInjectionsData();
  }, [fetchInjectionsData]);

  const handleDeleteInjection = async (injectionId: string) => {
    setLoading(true);
    try {
      await deleteInjection({ injectionId: injectionId });
      showToast({
        toast,
        type: "success",
        message: `Injection deleted successfully`,
      });
      fetchInjectionsData();
    } catch (e) {
      showToast({ toast, type: "error", message: `Error` });
      console.log("Error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex flex-row gap-2 items-center">
            <span className="font-bold text-lg">Injections</span>
            <Button
              variant="ghost"
              onClick={() => {
                setEditData(null);
                setIsDialogOpen(true);
              }}
            >
              {" "}
              Add{" "}
            </Button>
            <InjectionsDialog
              userDetailsId={userDetailsId}
              injectionsData={editData}
              isOpen={isDialogOpen}
              onClose={() => {
                setIsDialogOpen(false);
                fetchInjectionsData();
              }}
            />
          </div>
          {loading ? (
            <DataListShimmer />
          ) : (
            injectionsData &&
            injectionsData?.data &&
            injectionsData?.data.map((injections) => (
              <div
                key={injections.id}
                className="flex flex-row justify-between border rounded-md w-full p-3"
              >
                <div className="flex flex-col gap-4">
                  <div className="font-semibold flex flex-col gap-2">
                    {injections.injection_name}
                  </div>
                  <div className="flex flex-row gap-1">
                    <FormLabels label="Intake" value="" />
                    <Badge>
                      {injections.dosage_quantity} - {injections.dosage_unit}
                    </Badge>
                    <Badge>
                      {injections.frequency} - {injections.period_number}{" "}
                      {injections.period_unit}
                    </Badge>
                    <Badge>
                      {injections.parental_route} - {injections.site}
                    </Badge>
                  </div>
                  <div className="flex flex-row gap-4 flex-wrap">
                    <FormLabels
                      label="Lot number"
                      value={`${injections.lot_number}`}
                    />
                    <FormLabels
                      label="Expiration date"
                      value={`${injections.expiration_date.split("T")[0]}`}
                    />
                    <FormLabels
                      label="Note to nurse"
                      value={`${injections.note_to_nurse}`}
                    />
                    <FormLabels
                      label="Administered date"
                      value={`${injections.administered_date.split("T")[0]}`}
                    />
                    <FormLabels
                      label="comments"
                      value={`${injections.comments}`}
                    />
                  </div>
                </div>
                <div className="flex flex-row">
                  <Button
                    variant={"ghost"}
                    className="text-[#84012A]"
                    onClick={() => {
                      setEditData(injections);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Edit2Icon />
                  </Button>
                  <Button
                    variant={"ghost"}
                    className="text-[#84012A]"
                    onClick={() => handleDeleteInjection(injections.id)}
                  >
                    <Trash2Icon />
                  </Button>
                </div>
              </div>
            ))
          )}
          {injectionsData?.data.length === 0 && (
            <div className="flex flex-col justify-center items-center border rounded-md w-full h-full p-3 min-h-44">
              {" "}
              No injection data{" "}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewInjections;

