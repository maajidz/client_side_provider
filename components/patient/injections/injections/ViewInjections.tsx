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
  // Edit Data State
  const [editData, setEditData] = useState<InjectionsData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  // Pagination State
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 3;

  // Data State
  const [injectionsData, setInjectionsData] = useState<InjectionsResponse>();

  // Loading State
  const [loading, setLoading] = useState<boolean>(false);

  const { toast } = useToast();

  // GET Injections Data
  const fetchInjectionsData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getInjection({
        page: page,
        limit: limit,
        userDetailsId: userDetailsId,
      });

      if (response) {
        setInjectionsData(response);
        setTotalPages(Math.ceil(response.total / limit));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [userDetailsId, page, limit]);

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
            <div className="flex flex-col gap-2">
              <div className="flex flex-row text-sm items-center gap-2 self-end">
                <div className="text-gray-400">
                  Page {page} of {totalPages}
                </div>
                <div className="space-x-2 ml-auto @[768px]:ml-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={page <= 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page >= totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
              {injectionsData &&
                injectionsData?.data &&
                injectionsData?.data.map((injections) => (
                  <div
                    key={injections.id}
                    className="flex flex-row justify-between border rounded-md w-full p-3"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="font-semibold flex flex-col gap-2">
                        {injections.injectionType.injection_name}
                      </div>
                      <div className="flex flex-row gap-1">
                        <FormLabels label="Intake" value="" />
                        <Badge>
                          {injections.dosage_quantity} -{" "}
                          {injections.dosage_unit}
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
                          value={`${
                            injections.administered_date.split("T")[0]
                          }`}
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
                ))}
            </div>
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
