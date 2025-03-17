import LoadingButton from "@/components/LoadingButton";
import React, { useCallback, useEffect, useState } from "react";
import FamilyHistoryDialog from "./FamilyHistoryDialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { UserEncounterData } from "@/types/chartsInterface";
import {
  deleteFamilyHistory,
  getFamilyHistoryData,
} from "@/services/chartDetailsServices";
import {
  EditFamilyHistoryInterface,
  FamilyHistoryResponseInterface,
} from "@/types/familyHistoryInterface";
import FormLabels from "@/components/custom_buttons/FormLabels";
import { Button } from "@/components/ui/button";
import { Edit2, PlusCircle, Trash2Icon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { showToast } from "@/utils/utils";

const FamilyHistory = ({
  patientDetails,
}: {
  patientDetails: UserEncounterData;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<FamilyHistoryResponseInterface[]>([]);
  const [editData, setEditData] = useState<EditFamilyHistoryInterface | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const { toast } = useToast();

  const fetchFamilyHistory = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getFamilyHistoryData({
        limit: 10,
        page: 1,
        userDetailsId: patientDetails.userDetails.id,
      });
      if (response) {
        setData(response);
      }
    } catch (e) {
      console.log("Error", e);
    } finally {
      setLoading(false);
    }
  }, [patientDetails?.userDetails.id]);

  useEffect(() => {
    fetchFamilyHistory();
  }, [fetchFamilyHistory]);

  const handleDeleteFamilyHistory = async (familyHistroryId: string) => {
    setLoading(true);
    try {
      await deleteFamilyHistory({ familyHistoryId: familyHistroryId });
      showToast({
        toast,
        type: "success",
        message: "Alert deleted successfully",
      });
      fetchFamilyHistory();
    } catch (e) {
      console.log("Error:", e);
      showToast({ toast, type: "error", message: "Error" });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingButton />;
  }

  return (
    <div className="flex flex-col gap-3 group">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="familyHistory">
          <div className="flex justify-between items-center">
            <AccordionTrigger>Family History</AccordionTrigger>
            <Button
              variant="ghost"
              onClick={() => {
                setEditData(null);
                setIsDialogOpen(true);
              }}
              className="invisible group-hover:visible"
            >
              <PlusCircle />
            </Button>
            <FamilyHistoryDialog
              userDetailsId={patientDetails.userDetails.id}
              familyHistoryData={editData}
              onClose={() => {
                setIsDialogOpen(false);
                fetchFamilyHistory();
              }}
              isOpen={isDialogOpen}
            />
          </div>
          <AccordionContent className="sm:max-w-4xl">
            <div className="flex flex-col gap-3">
              {data.map((familyHistory, index) => (
                <div key={index} className="flex flex-col gap-2 border rounded-lg p-2">
                  <div className="flex justify-between items-center">
                    <div className="text-base font-semibold">
                      {familyHistory.id}{" "}
                    </div>
                    <div className="flex">
                      <Button
                        variant={"ghost"}
                        onClick={() => {
                          setEditData({
                            relationship: familyHistory.relationship,
                            deceased: familyHistory.deceased,
                            age: familyHistory.age,
                            comments: familyHistory.comments,
                            activeProblems: familyHistory.activeProblems?.map(
                              (problemName) => ({
                                name: problemName.name,
                                addtionaltext: "",
                              })
                            ),
                            id: familyHistory.id,
                          });
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit2 color="#84012A" />
                      </Button>
                      <Button
                        variant={"ghost"}
                        onClick={() =>
                          handleDeleteFamilyHistory(familyHistory.id)
                        }
                      >
                        <Trash2Icon color="#84012A" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 ">
                    <FormLabels
                      label="Relationship/Age"
                      value={`${familyHistory.relationship}/${familyHistory.age}`}
                    />
                    <FormLabels
                      label="Active Problems"
                      value={familyHistory.activeProblems.map((problems) => (
                        <div key={problems.id}> {problems.name} </div>
                      ))}
                    />
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default FamilyHistory;
