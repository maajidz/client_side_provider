import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { getTasks, getTasksTypes } from "@/services/chartDetailsServices";
import { UserEncounterData } from "@/types/chartsInterface";
import {
  TasksResponseDataInterface,
  TaskTypeResponse,
} from "@/types/tasksInterface";
import TasksDialog from "./TasksDialog";
import TasksList from "./TasksList";
import { PlusCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { fetchProviderListDetails } from "@/services/registerServices";
import { FetchProviderList } from "@/types/providerDetailsInterface";
import { showToast } from "@/utils/utils";
import { useToast } from "@/hooks/use-toast";

const Tasks = ({ patientDetails }: { patientDetails: UserEncounterData }) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [editData, setEditData] = useState<TasksResponseDataInterface | null>(
    null
  );
  const [ownersList, setOwnersList] = useState<FetchProviderList[]>([]);
  const [tasksListData, setTasksListData] = useState<TaskTypeResponse | null>(
    null
  );
  const [tasksData, setTasksData] = useState<TasksResponseDataInterface[]>();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { toast } = useToast();

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

  const fetchOwnersList = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetchProviderListDetails({ page: 1, limit: 10 });

      if (response) {
        setOwnersList(response.data || []);
      }
    } catch (err) {
      console.log(err);
      showToast({
        toast,
        type: "error",
        message: "Failed to fetch owners list.",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchTasksList = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getTasksTypes({
        page: 1,
        limit: 10,
      });

      if (response) {
        setTasksListData(response);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    fetchOwnersList();
    fetchTasksList();
  }, [fetchTasks, fetchOwnersList, fetchTasksList]);

  return (
    <div className="flex flex-col gap-3 group">
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
              className="invisible group-hover:visible"
            >
              <PlusCircle />
            </Button>
            <TasksDialog
              isOpen={isDialogOpen}
              userDetailsId={patientDetails.userDetails.userDetailsId}
              tasksData={editData}
              onClose={() => {
                setIsDialogOpen(false);
              }}
              ownersList={ownersList}
              tasksListData={tasksListData}
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
