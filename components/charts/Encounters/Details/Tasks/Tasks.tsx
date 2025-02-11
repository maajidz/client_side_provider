import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { getTasks } from "@/services/chartDetailsServices";
import { UserEncounterData } from "@/types/chartsInterface";
import { TasksResponseDataInterface } from "@/types/tasksInterface";
import TasksDialog from "./TasksDialog";
import TasksList from "./TasksList";
import { PlusCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const Tasks = ({ patientDetails }: { patientDetails: UserEncounterData }) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [editData, setEditData] = useState<TasksResponseDataInterface | null>(
    null
  );

  const [tasksData, setTasksData] = useState<TasksResponseDataInterface[]>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true);

    try {
      if (patientDetails?.providerID) {
        const response = await getTasks({
          providerId: patientDetails?.providerID,
          page: 1,
          limit: 10,
        });

        if (response) {
          setTasksData(response.data);
        }
      } else {
        throw new Error("Missing provider ID");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError("Something went wrong");
      } else {
        setError("Something went wrong. Unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }, [patientDetails?.providerID]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div className="flex flex-col gap-3">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="tasks">
          <div className="flex justify-between items-center">
            <AccordionTrigger>Tasks</AccordionTrigger>
            <Button
              variant="ghost"
              onClick={() => {
                setEditData(null);
                setIsDialogOpen(true);
              }}
            >
              <PlusCircle />
            </Button>
            <TasksDialog
              isOpen={isDialogOpen}
              userDetailsId={patientDetails.userDetails.id}
              tasksData={editData}
              onClose={() => {
                setIsDialogOpen(false);
              }}
            />
          </div>
          <AccordionContent className="sm:max-w-4xl">
            <TasksList
              error={error}
              isLoading={loading}
              patientDetails={patientDetails}
              tasksData={tasksData}
              onFetchTasks={fetchTasks}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Tasks;
