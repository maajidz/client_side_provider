import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React from "react";
import TasksDialog from "./TasksDialog";
import TasksList from "./TasksList";
import { UserEncounterData } from "@/types/chartsInterface";

const Tasks = ({
  patientDetails,
}: {
  patientDetails: UserEncounterData;
}) => {
  return (
    <div className="flex flex-col gap-3">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="tasks">
          <div className="flex justify-between items-center">
            <AccordionTrigger>Tasks</AccordionTrigger>
            <TasksDialog patientDetails={patientDetails}/>
          </div>
          <AccordionContent className="sm:max-w-4xl">
            <TasksList patientDetails={patientDetails} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Tasks;
