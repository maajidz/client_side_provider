import React, { useCallback, useEffect, useState } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { RootState } from "@/store/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";
import { columns } from "@/components/tasks/columns";
import LoadingButton from "@/components/LoadingButton";
import { getTasks, getTasksTypes } from "@/services/chartDetailsServices";
import {
  TasksResponseDataInterface,
  TasksResponseInterface,
  TaskTypeList,
  TaskTypeResponse,
} from "@/types/tasksInterface";
import { filterTasksSchema } from "@/schema/tasksSchema";
import { priority, taskStatus } from "@/constants/data";
import { showToast } from "@/utils/utils";
import { useToast } from "@/hooks/use-toast";
import AddTaskComment from "./AddTaskComment";
import EditPatientTaskDialog from "./EditPatientTaskDialog";
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";
import { Button } from "@/components/ui/button";
import { Search, XCircle } from "lucide-react";
import TasksDialog from "@/components/charts/Encounters/Details/Tasks/TasksDialog";
import { FetchProviderList } from "@/types/providerDetailsInterface";
import { fetchProviderListDetails } from "@/services/registerServices";

const ViewPatientTasks = ({ userDetailsId }: { userDetailsId: string }) => {
  const providerDetails = useSelector((state: RootState) => state.login);
  const [ownersList, setOwnersList] = useState<FetchProviderList[]>([]);
  const [tasksListData, setTasksListData] = useState<TaskTypeResponse | null>(
    null
  );
  const [taskTypes, setTaskTypes] = useState<TaskTypeList[]>([]);
  const [resultList, setResultList] = useState<TasksResponseInterface>();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const limit = 5;
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isCommentDialogOpen, setIsCommentDialogOpen] =
    useState<boolean>(false);
  const [editData, setEditData] = useState<TasksResponseDataInterface | null>(
    null
  );
  const [filters, setFilters] = useState({
    status: "",
    category: "",
    priority: "",
  });

  const { toast } = useToast();

  const form = useForm<z.infer<typeof filterTasksSchema>>({
    resolver: zodResolver(filterTasksSchema),
    defaultValues: {
      category: "",
      status: "",
      priority: "",
      userDetailsId: "",
    },
  });

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
        icon: XCircle,
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

  function onSubmit(values: z.infer<typeof filterTasksSchema>) {
    setFilters((prev) => ({
      ...prev,

      status: values.status === "all" ? "" : values.status || "",
      category: values.category === "all" ? "" : values.category || "",
      priority: values.priority === "all" ? "" : values.priority || "",
    }));

    setPage(1);
  }

  const fetchTaskTypes = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getTasksTypes({
        page: 1,
        limit: 10,
      });

      if (response) {
        setTaskTypes(response.taskTypes);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTasks = useCallback(
    async (
      page: number,
      userDetailsId: string,
      status?: string,
      category?: string,
      priority?: string
    ) => {
      try {
        setLoading(true);
        if (providerDetails) {
          const response = await getTasks({
            providerId: providerDetails.providerId,
            limit: limit,
            page: page,
            status: status?.toUpperCase() || filters.status.toUpperCase(),
            category: category || filters.category,
            priority: priority || filters.priority,
            userDetailsId: userDetailsId,
          });
          if (response) {
            setResultList(response);
            setTotalPages(Math.ceil(response.total / Number(response.limit)));
          }
          setLoading(false);
        }
      } catch (e) {
        console.log("Error", e);
      } finally {
        setLoading(false);
      }
    },
    [providerDetails, filters]
  );

  useEffect(() => {
    fetchTasks(page, userDetailsId);
    fetchTaskTypes();
    fetchOwnersList();
    fetchTasksList();
  }, [
    page,
    fetchTasksList,
    fetchTasks,
    fetchTaskTypes,
    fetchOwnersList,
    userDetailsId,
  ]);

  if (loading) {
    return <LoadingButton />;
  }

  const handleCommentDialogClose = () => {
    setIsCommentDialogOpen(false);
    setEditData(null);
    fetchTasks(page, userDetailsId);
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
    setEditData(null);
    fetchTasks(page, userDetailsId);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    fetchTasks(page, userDetailsId);
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex gap-2 flex-row"
          >
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="flex-none">
                  <FormLabel className="w-fit">Category</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-fit text-sm font-medium">
                        <SelectValue placeholder="Choose Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {taskTypes.map((type) => (
                          <SelectItem key={type.id} value={type.name}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex flex-none">
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-fit text-sm font-medium">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {taskStatus.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem className="flex-none">
                  <FormLabel>Priority</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-fit text-sm font-medium">
                        <SelectValue placeholder="Choose Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {priority.map((priority) => (
                          <SelectItem
                            value={priority}
                            key={priority}
                            className="capitalize"
                          >
                            {priority}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex items-end">
              <Button type="submit" variant={"default"} className="bg-primary">
                Search <Search />
              </Button>
            </div>
          </form>
        </Form>
        {/* Results Table */}
        <div className="flex gap-6 flex-col">
          <TasksDialog
            userDetailsId={userDetailsId}
            onClose={handleDialogClose}
            isOpen={isDialogOpen}
            ownersList={ownersList}
            tasksListData={tasksListData}
          />
          {resultList?.data && (
            <DefaultDataTable
              title={"Patient Tasks"}
              onAddClick={() => setIsDialogOpen(true)}
              columns={columns({
                setEditData,
                setIsEditDialogOpen,
                setIsCommentDialogOpen,
                setLoading,
                showToast: ({ type, message }) => {
                  showToast({
                    toast,
                    type: type === "success" ? "success" : "error",
                    message,
                  });
                },
                // showToast: (args) => showToast({ toast, ...args }),
                fetchTasksList: () => fetchTasks(page, userDetailsId),
                isPatientTask: true,
              })}
              data={resultList?.data}
              pageNo={page}
              totalPages={totalPages}
              onPageChange={(newPage: number) => setPage(newPage)}
            />
          )}

          <AddTaskComment
            tasksData={editData}
            onClose={handleCommentDialogClose}
            isOpen={isCommentDialogOpen}
          />
          <EditPatientTaskDialog
            tasksData={editData}
            userDetailsId={userDetailsId}
            isOpen={isEditDialogOpen}
            ownersList={ownersList}
            tasksListData={tasksListData}
            onClose={handleEditDialogClose}
            onFetchTasks={fetchTasksList}
          />
        </div>
      </div>
    </>
  );
};

export default ViewPatientTasks;
