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
import { getTasks } from "@/services/chartDetailsServices";
import {
  TasksResponseDataInterface,
  TasksResponseInterface,
} from "@/types/tasksInterface";
import { filterTasksSchema } from "@/schema/tasksSchema";
import { categoryOptions, priority, status } from "@/constants/data";
import { showToast } from "@/utils/utils";
import { useToast } from "@/hooks/use-toast";
import AddTaskComment from "./AddTaskComment";
import EditPatientTaskDialog from "./EditPatientTaskDialog";
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const ViewPatientTasks = ({
  userDetailsId,
  refreshTrigger,
}: {
  userDetailsId: string;
  refreshTrigger: number;
}) => {
  const providerDetails = useSelector((state: RootState) => state.login);
  const [resultList, setResultList] = useState<TasksResponseInterface>();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const limit = 5;
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
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

  function onSubmit(values: z.infer<typeof filterTasksSchema>) {
    setFilters((prev) => ({
      ...prev,

      status: values.status ==="all" ? "" : values.status || "",
      category: values.category ==="all" ? "" : values.category || "",
      priority: values.priority ==="all" ? "" : values.priority || "",
    }));

    setPage(1);
  }

  const fetchTasksList = useCallback(
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
            status: status || filters.status,
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
    fetchTasksList(page, userDetailsId);
  }, [page, fetchTasksList, userDetailsId, refreshTrigger]);

  if (loading) {
    return <LoadingButton />;
  }

  const handleCommentDialogClose = () => {
    setIsCommentDialogOpen(false);
    setEditData(null);
    fetchTasksList(page, userDetailsId);
  };

  const handleEditDialogClose = () => {
    setIsDialogOpen(false);
    setEditData(null);
    fetchTasksList(page, userDetailsId);
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
                <FormItem className="flex flex-1">
                  <FormLabel className="w-fit">Category</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose Category" />
                      </SelectTrigger>
                      <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                        {categoryOptions.map((category) => (
                          <SelectItem
                            key={category.value}
                            value={category.value}
                          >
                            {category.label}
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
                <FormItem className="flex flex-1">
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                        {status.map((status) => (
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
                <FormItem className="flex flex-1">
                  <FormLabel>Priority</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose Priority" />
                      </SelectTrigger>
                      <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                        {priority.map((priority) => (
                          <SelectItem value={priority} key={priority}>
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
              <Button variant={"secondary"}>Search <Search/></Button>
            </div>
          </form>
        </Form>
        {/* Results Table */}
        <div className="flex gap-6 flex-col">
          {resultList?.data && (
            <DefaultDataTable
              columns={columns({
                setEditData,
                setIsDialogOpen,
                setIsCommentDialogOpen,
                setLoading,
                showToast: () =>
                  showToast({
                    toast,
                    type: "success",
                    message: "Deleted Successfully",
                  }),
                fetchTasksList: () => fetchTasksList(page, userDetailsId),
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
            isOpen={isDialogOpen}
            onClose={handleEditDialogClose}
            onFetchTasks={fetchTasksList}
          />
        </div>
      </div>
    </>
  );
};

export default ViewPatientTasks;
