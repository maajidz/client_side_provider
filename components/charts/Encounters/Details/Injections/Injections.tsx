import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import InjectionsDialog from "./InjectionsDialog";
import { UserEncounterData } from "@/types/chartsInterface";

const Injections = ({patientDetails}: {patientDetails: UserEncounterData}) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  return (
    <>
      <div className="flex flex-col gap-3">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="familyHistory">
            <div className="flex justify-between items-center">
              <AccordionTrigger>Injections</AccordionTrigger>
              <Button
                variant="ghost"
                onClick={() => {
                //   setEditData(null);
                  setIsDialogOpen(true);
                }}
              >
                <PlusCircle />
              </Button>
              <InjectionsDialog
                userDetailsId={patientDetails.userDetails.id}
                // injectionsData={editData}
                onClose={() => {
                  setIsDialogOpen(false);
                //   fetchFamilyHistory();
                }}
                isOpen={isDialogOpen}
              />
            </div>
            <AccordionContent className="sm:max-w-4xl">
              {/* <div className="flex flex-col gap-3">
                {data.map((familyHistory, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-2 border rounded-lg p-2"
                  >
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
              </div> */}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
};

export default Injections;
