import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  deleteTask,
  getTasks,
  getTasksTypes,
} from "@/services/chartDetailsServices";
import { UserEncounterData } from "@/types/chartsInterface";
import {
  TasksResponseDataInterface,
  TaskTypeResponse,
} from "@/types/tasksInterface";
import TasksDialog from "./TasksDialog";
import {
  ChevronLeft,
  ChevronRight,
  Edit2,
  PlusCircle,
  Trash2Icon,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { showToast } from "@/utils/utils";
import { useToast } from "@/hooks/use-toast";
import AccordionShimmerCard from "@/components/custom_buttons/shimmer/AccordionCardShimmer";
import { Badge } from "@/components/ui/badge";

const Tasks = ({ patientDetails }: { patientDetails: UserEncounterData }) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [editData, setEditData] = useState<TasksResponseDataInterface | null>(
    null
  );
  const [tasksListData, setTasksListData] = useState<TaskTypeResponse | null>(
    null
  );
  const [tasksData, setTasksData] = useState<TasksResponseDataInterface[]>();
  const [loading, setLoading] = useState<boolean>(false);

  // Pagination State
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 3;

  const { toast } = useToast();

  const fetchTasks = useCallback(async () => {
    setLoading(true);

    try {
      if (patientDetails?.providerID) {
        const response = await getTasks({
          providerId: patientDetails?.providerID,
          page: page,
          limit: limit,
        });

        if (response) {
          setTasksData(response.data);
          setTotalPages(Math.ceil(response.total / limit));
        }
      } else {
        throw new Error("Missing provider ID");
      }
    } catch (error) {
      showToast({
        toast,
        type: "error",
        message: `Error fetching supplement data: ${error}`,
      });
    } finally {
      setLoading(false);
    }
  }, [patientDetails?.providerID, page, limit, toast]);

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
    fetchTasksList();
  }, [fetchTasks, fetchTasksList]);

  const handleDeleteTask = async (taskId: string) => {
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
  };

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
                fetchTasks();
                setEditData(null);
              }}
              tasksListData={tasksListData}
            />
          </div>
          <AccordionContent className="sm:max-w-4xl">
            {loading ? (
              <AccordionShimmerCard />
            ) : (
              <div className="flex flex-col gap-2">
                <div className="space-x-2 self-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={page <= 1}
                  >
                    <ChevronLeft />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page >= totalPages}
                  >
                    <ChevronRight />
                  </Button>
                </div>
                {tasksData && tasksData.length > 0 ? (
                  tasksData.map((task) => (
                    <div
                      key={task.id}
                      className="flex flex-col gap-2 border rounded-md p-2"
                    >
                      <div className="flex justify-between items-center">
                        <h5 className="text-lg font-semibold">
                          {task?.taskType.name}
                        </h5>
                        <div className="flex items-center">
                          <Button
                            variant={"ghost"}
                            onClick={() => {
                              setEditData(task);
                              setIsDialogOpen(true);
                            }}
                          >
                            <Edit2 color="#84012A" />
                          </Button>
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
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Tasks;
