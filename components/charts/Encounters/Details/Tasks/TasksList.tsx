import LoadingButton from "@/components/LoadingButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { deleteTask, getTasks } from "@/services/chartDetailsServices";
import { UserEncounterData } from "@/types/chartsInterface";
import { TasksResponseDataInterface } from "@/types/tasksInterface";
import { showToast } from "@/utils/utils";
import { Trash2Icon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import EditTask from "./EditTask";

interface TasksListProps {
  patientDetails: UserEncounterData;
}

function TasksList({ patientDetails }: TasksListProps) {
  const [tasksData, setTasksData] = useState<TasksResponseDataInterface[]>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  async function handleDeleteTask(taskId: string) {
    setLoading(true);
    console.log(`Task ID: ${taskId}`);

    try {
      await deleteTask({ id: taskId });

      showToast({
        toast,
        type: "success",
        message: `Task deleted successfully`,
      });
    } catch (err) {
      if (err instanceof Error)
        showToast({
          toast,
          type: "error",
          message: `Could not delete selected task`,
        });
    } finally {
      setLoading(false);
      fetchTasks();
    }
  }

  if (loading) return <LoadingButton />;

  if (error)
    return <div className="flex items-center justify-center">{error}</div>;

  return (
    <div>
      {tasksData && tasksData.length > 0 ? (
        tasksData.map((task) => (
          <div
            key={task.id}
            className="flex flex-col gap-2 border rounded-md p-2"
          >
            <div className="flex justify-between items-center">
              <h5 className="text-lg font-semibold">{task?.category}</h5>
              <div className="flex items-center">
                <EditTask patientDetails={patientDetails} selectedTask={task} />
                <Button
                  variant="ghost"
                  onClick={() => {
                    handleDeleteTask(task?.id);
                  }}
                  disabled={loading}
                >
                  <Trash2Icon color="#84012A" />
                </Button>
              </div>
            </div>
            <span className="font-semibold">
              Due Date: {new Date(task?.dueDate).toLocaleDateString()}
            </span>
            <span className="text-md">
              <span>Description: {task.description}</span>
            </span>
            <span className="text-md">Notes: {task.notes}</span>
            <Badge
              className={`w-fit px-2 py-0.5 text-md rounded-full border-[1px] ${
                task.status.toLowerCase() === "pending"
                  ? "bg-yellow-100 text-yellow-500 border-yellow-500 hover:bg-yellow-100"
                  : "bg-[#ABEFC6] text-[#067647] border-[#067647] hover:bg-[#ABEFC6]"
              }`}
            >
              {task.status}
            </Badge>
          </div>
        ))
      ) : (
        <div className="flex items-center justify-center">
          No tasks available
        </div>
      )}
    </div>
  );
}

export default TasksList;
