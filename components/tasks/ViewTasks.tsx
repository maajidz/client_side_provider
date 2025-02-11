import React, { useCallback, useEffect, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import { columns } from "./columns";
import LoadingButton from "@/components/LoadingButton";
import { getTasks } from "@/services/chartDetailsServices";
import {
  TasksResponseDataInterface,
  TasksResponseInterface,
} from "@/types/tasksInterface";
import { filterTasksSchema } from "@/schema/tasksSchema";
import { categoryOptions, priority, status } from "@/constants/data";
import TasksDialog from "./TasksDialog";
import { showToast } from "@/utils/utils";
import { useToast } from "@/hooks/use-toast";
import { UserData } from "@/types/userInterface";
import { fetchUserDataResponse } from "@/services/userServices";
import SubmitButton from "../custom_buttons/buttons/SubmitButton";

const ViewTasks = () => {
  const providerDetails = useSelector((state: RootState) => state.login);
  const [resultList, setResultList] = useState<TasksResponseInterface>();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<number>(1);
  const limit = 8;
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [editData, setEditData] = useState<TasksResponseDataInterface | null>(
    null
  );
  const [patients, setPatients] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleSearchList, setVisibleSearchList] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    status: "",
    category: "",
    priority: "",
    userDetailsId: "",
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

      status: values.status || "",
      category: values.category || "",
      priority: values.priority || "",
      userDetailsId: values.userDetailsId || "",
    }));

    setPage(1);
  }

  const fetchTasksList = useCallback(
    async (
      page: number,
      status?: string,
      category?: string,
      priority?: string,
      userDetailsId?: string
    ) => {
      try {
        if (providerDetails) {
          const response = await getTasks({
            providerId: providerDetails.providerId,
            limit: limit,
            page: page,
            status: status || filters.status,
            category: category || filters.category,
            priority: priority || filters.priority,
            userDetailsId: userDetailsId || filters.userDetailsId,
          });
          if (response) {
            setResultList(response);
            setTotalPages(Math.ceil(response.total / Number(response.limit)));
          }
          setLoading(false);
        }
      } catch (e) {
        console.log("Error", e);
      }
    },
    [providerDetails, filters]
  );

  const fetchPatientList = useCallback(async () => {
    if (!searchTerm) return;
    setLoading(true);
    try {
      const response = await fetchUserDataResponse({
        firstName: searchTerm,
        lastName: searchTerm,
      });
      if (response) {
        setPatients(response.data || []);
      }
    } catch (e) {
      console.log("Error", e);
      showToast({ toast, type: "error", message: "Failed to fetch patient" });
    } finally {
      setLoading(false);
    }
  }, [searchTerm, toast]);

  const filteredPatients = patients.filter((patient) =>
    `${patient.user.firstName} ${patient.user.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchPatientList();
  }, [fetchPatientList]);

  useEffect(() => {
    fetchTasksList(page);
  }, [filters, fetchTasksList, page]);

  if (loading) {
    return <LoadingButton />;
  }

  return (
    <>
      <div className="">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex justify-between"
          >
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
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
                <FormItem>
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
                <FormItem>
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
            <FormField
              control={form.control}
              name="userDetailsId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patient</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Search Patient "
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setVisibleSearchList(true);
                        }}
                      />
                      {searchTerm && visibleSearchList && (
                        <div className="absolute bg-white border border-gray-300 mt-1 rounded shadow-lg  w-full">
                          {filteredPatients.length > 0 ? (
                            filteredPatients.map((patient) => (
                              <div
                                key={patient.id}
                                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                onClick={() => {
                                  field.onChange(patient.id);
                                  setSearchTerm(
                                    `${patient.user.firstName} ${patient.user.lastName}`
                                  );
                                  setVisibleSearchList(false);
                                }}
                              >
                                {`${patient.user.firstName} ${patient.user.lastName} ${patient.id}`}
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-2 text-gray-500">
                              No results found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-end">
              <SubmitButton label="Search" />
            </div>
          </form>
        </Form>

        {/* Results Table */}
        <div className="py-5">
          {resultList?.data && (
            <DataTable
              searchKey="id"
              columns={columns({
                setEditData,
                setIsCommentDialogOpen: () => {},
                setIsDialogOpen,
                setLoading,
                showToast: () =>
                  showToast({
                    toast,
                    type: "success",
                    message: "Deleted Successfully",
                  }),
                fetchTasksList: () => fetchTasksList(page),
                isPatientTask: false,
              })}
              data={resultList?.data}
              pageNo={page}
              totalPages={totalPages}
              onPageChange={(newPage: number) => setPage(newPage)}
            />
          )}

          <TasksDialog
            tasksData={editData}
            onClose={() => {
              setIsDialogOpen(false);
            }}
            isOpen={isDialogOpen}
          />
        </div>
      </div>
    </>
  );
};

export default ViewTasks;
