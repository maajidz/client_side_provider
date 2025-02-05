import LoadingButton from "@/components/LoadingButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { deleteTask } from "@/services/chartDetailsServices";
import { UserEncounterData } from "@/types/chartsInterface";
import { TasksResponseDataInterface } from "@/types/tasksInterface";
import { showToast } from "@/utils/utils";
import EditTask from "./EditTask";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";

interface TasksListProps {
  error: string;
  isLoading: boolean;
  patientDetails: UserEncounterData;
  tasksData: TasksResponseDataInterface[] | undefined;
  onFetchTasks: () => Promise<void>;
}

function TasksList({
  error,
  isLoading,
  patientDetails,
  tasksData,
  onFetchTasks,
}: TasksListProps) {
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

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
      await onFetchTasks();
    }
  }

  if (isLoading) return <LoadingButton />;

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
