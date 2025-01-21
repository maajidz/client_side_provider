import React from "react";
import LoadingButton from "@/components/LoadingButton";
import { deleteInjection, getInjection } from "@/services/injectionsServices";
import {
  InjectionsData,
  InjectionsResponse,
} from "@/types/injectionsInterface";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import FormLabels from "@/components/custom_buttons/FormLabels";
import { Edit2Icon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showToast } from "@/utils/utils";
import InjectionsDialog from "@/components/charts/Encounters/Details/Injections/InjectionsDialog";
import { PlusIcon } from "lucide-react";

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

  if (loading) return <LoadingButton />;

  return (
    <>
      <div className="flex justify-end">
        <Button
          className="bg-[#84012A]"
          onClick={() => {
            setEditData(null);
            setIsDialogOpen(true);
          }}
        >
          <div className="flex gap-2">
            <PlusIcon />
            Injections
          </div>
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
      <div className="flex flex-col gap-3 m-5">
        {injectionsData ? (
          injectionsData?.data.map((injections) => (
            <div
              key={injections.id}
              className="flex flex-row justify-between border rounded-md w-full p-3"
            >
              <div>
                <FormLabels label={injections.injection_name} value="" />
                <FormLabels
                  label="Intake"
                  value={`${injections.dosage_quantity} ${injections.dosage_unit},  ${injections.frequency}    ${injections.period_number} ${injections.period_unit} ,  ${injections.parental_route} ${injections.site}`}
                />
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
                <FormLabels label="comments" value={`${injections.comments}`} />
                <FormLabels
                  label="Administered date"
                  value={`${injections.administered_date.split("T")[0]}`}
                />
              </div>
              <div>
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
        ) : (
          <div> No data </div>
        )}
      </div>
    </>
  );
};

export default ViewInjections;
