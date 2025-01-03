import LoadingButton from "@/components/LoadingButton";
import { getTasks } from "@/services/chartDetailsServices";
import { RootState } from "@/store/store";
import { TasksInterface } from "@/types/tasksInterface";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

function TasksList() {
  const providerId = useSelector((state: RootState) => state.login.providerId);
  const [tasksData, setTasksData] = useState<TasksInterface[]>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getTasks({
        providerId,
        page: 1,
        limit: 10,
      });

      if (response) {
        setTasksData(response);
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
  }, [providerId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  if (loading) return <LoadingButton />;

  if (error)
    return <div className="flex items-center justify-center">{error}</div>;

  return (
    <div>
      {tasksData && tasksData.length > 0 ? (
        tasksData.map((task) => (
          <div key={task.category} className="flex flex-col gap-2 border p-2">
            {task.description}
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

