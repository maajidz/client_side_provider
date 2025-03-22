import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
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
  PlusCircle,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { showToast } from "@/utils/utils";
import { useToast } from "@/hooks/use-toast";
import AccordionShimmerCard from "@/components/custom_buttons/shimmer/AccordionCardShimmer";
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";
import { columns } from "@/components/tasks/columns";

const Tasks = ({ patientDetails }: { patientDetails: UserEncounterData }) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [editData, setEditData] = useState<TasksResponseDataInterface | null>(
    null
  );
  const [tasksListData, setTasksListData] = useState<TaskTypeResponse | null>(
    null
  );
  const [tasksData, setTasksData] = useState<TasksResponseDataInterface[]>([]);
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
        message: `Error fetching tasks: ${error}`,
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

  // const handleDeleteTask = async (taskId: string) => {
  //   setLoading(true);
  //   console.log(`Task ID: ${taskId}`);

  //   try {
  //     await deleteTask({ id: taskId });

  //     showToast({
  //       toast,
  //       type: "success",
  //       message: `Task deleted successfully`,
  //     });
  //   } catch (err) {
  //     if (err instanceof Error)
  //       showToast({
  //         toast,
  //         type: "error",
  //         message: `Could not delete selected task`,
  //       });
  //   } finally {
  //     setLoading(false);
  //     fetchTasks();
  //   }
  // };

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
                <DefaultDataTable
                  // title="Tasks"
                  columns={columns({
                    setEditData,
                    setIsEditDialogOpen: setIsDialogOpen,
                    setTaskLoading: setLoading,
                    showToast: ({ type, message }: { type: "success" | "error"; message: string }) => showToast({ toast, type, message }),
                    fetchTasksList,
                    setIsCommentDialogOpen: () => {},
                    isPatientTask: true,
                  })}
                  data={tasksData}
                  pageNo={page}
                  totalPages={totalPages}
                  onPageChange={(newPage) => setPage(newPage)}
                  // onAddClick={() => {
                  //   setEditData(null);
                  //   setIsDialogOpen(true);
                  // }}
                  className="mt-4"
                />
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Tasks;
