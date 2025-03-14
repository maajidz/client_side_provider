import React, { useCallback, useEffect, useState } from "react";
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
import { getTasks, getTasksTypes } from "@/services/chartDetailsServices";
import {
  TasksResponseDataInterface,
  TasksResponseInterface,
  TaskTypeList,
} from "@/types/tasksInterface";
import { filterTasksSchema } from "@/schema/tasksSchema";
import { priority, taskStatus } from "@/constants/data";
import TasksDialog from "./TasksDialog";
import { showToast } from "@/utils/utils";
import { useToast } from "@/hooks/use-toast";
import { UserData } from "@/types/userInterface";
import { fetchUserDataResponse } from "@/services/userServices";
import SubmitButton from "../custom_buttons/buttons/SubmitButton";
import formStyles from "@/components/formStyles.module.css";
import { DefaultDataTable } from "../custom_buttons/table/DefaultDataTable";
import TableShimmer from "../custom_buttons/table/TableShimmer";

const ViewTasks = () => {
  // Provider Details
  const providerDetails = useSelector((state: RootState) => state.login);

  // Tasks Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  // Task Types List Data State
  const [taskTypes, setTaskTypes] = useState<TaskTypeList[]>([]);

  // Tasks Data List State
  const [resultList, setResultList] = useState<TasksResponseInterface>();

  // Edit Task Data State
  const [editData, setEditData] = useState<TasksResponseDataInterface | null>(
    null
  );

  // Patient List state
  const [patients, setPatients] = useState<UserData[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  // search States
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [visibleSearchList, setVisibleSearchList] = useState<boolean>(false);

  // Loading States
  const [loading, setLoading] = useState<boolean>(false);
  const [patientLoading, setPatientLoading] = useState<boolean>(false);
  const [dataLoading, setDataLoading] = useState<boolean>(false);

  // Pagination States
  const [page, setPage] = useState<number>(1);
  const limit = 8;
  const [totalPages, setTotalPages] = useState<number>(1);

  // Filter State
  const [filters, setFilters] = useState({
    status: "",
    category: "",
    priority: "",
    userDetailsId: "",
  });

  const { toast } = useToast();

  // Form Definition
  const form = useForm<z.infer<typeof filterTasksSchema>>({
    resolver: zodResolver(filterTasksSchema),
    defaultValues: {
      category: "",
      status: "",
      priority: "",
      userDetailsId: "",
    },
  });

  // Fetch Task Types Data
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

  // Fetch Patient Data
  const fetchPatientList = useCallback(async () => {
    if (!searchTerm) return;
    setPatientLoading(true);
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
      setPatientLoading(false);
    }
  }, [searchTerm, toast]);

  // Fetch Tasks Data
  const fetchTasksList = useCallback(
    async (
      page: number,
      status?: string,
      category?: string,
      priority?: string,
      userDetailsId?: string
    ) => {
      try {
        setDataLoading(true);
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
          setDataLoading(false);
        }
      } catch (e) {
        console.log("Error", e);
      } finally {
        setDataLoading(false);
      }
    },
    [providerDetails, filters]
  );

  // Patient useEffect
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim()) {
        fetchPatientList();
      } else {
        setPatients([]);
        setSelectedUser(null);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchPatientList]);

  // Filter Patients
  const filteredPatients = patients.filter((patient) =>
    `${patient.user.firstName} ${patient.user.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  //Effects
  useEffect(() => {
    fetchTasksList(
      page,
      filters.status,
      filters.category,
      filters.priority,
      filters.userDetailsId
    );
    fetchTaskTypes();
  }, [filters, fetchTasksList, page, fetchTaskTypes]);

  // Dialog Close Function
  const handleEditDialogClose = () => {
    setIsDialogOpen(false);
    setEditData(null);
    fetchTasksList(page);
  };

  // Submit handler Function
  function onSubmit(values: z.infer<typeof filterTasksSchema>) {
    setFilters((prev) => ({
      ...prev,

      status: values.status === "all" ? "" : values.status || "",
      category: values.category === "all" ? "" : values.category || "",
      priority: values.priority === "all" ? "" : values.priority || "",
      userDetailsId:
        values.userDetailsId === "all" ? "" : values.userDetailsId || "",
    }));

    setPage(1);
  }

  return (
    <>
      <div className="">
        {/* Filter Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={formStyles.formFilterBody}
          >
            {/* Category Filter */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className={formStyles.formFilterItem}>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {loading ? (
                          <div>Loading...</div>
                        ) : (
                          taskTypes.map((type) => (
                            <SelectItem key={type.id} value={type.name}>
                              {type.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status Filter */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className={formStyles.formFilterItem}>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {taskStatus.map((status) => (
                          <SelectItem
                            key={status.value}
                            value={status.value.toUpperCase()}
                          >
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

            {/* Priority Filter */}
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem className={formStyles.formFilterItem}>
                  <FormLabel>Priority</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
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

            {/* Patient Filter */}
            <FormField
              control={form.control}
              name="userDetailsId"
              render={({ field }) => (
                <FormItem className={formStyles.formFilterItem}>
                  <FormLabel>Patient</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="flex gap-2 border pr-2 rounded-md items-baseline">
                        <Input
                          placeholder="Search Patient "
                          value={searchTerm}
                          onChange={(e) => {
                            const value = e.target.value;
                            setSearchTerm(value);
                            setVisibleSearchList(true);

                            if (!value) {
                              field.onChange("");
                            }
                          }}
                          className="border-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 "
                        />
                        <div className="px-3 py-1 text-base">
                          {" "}
                          {selectedUser?.patientId}
                        </div>
                      </div>
                      {searchTerm && visibleSearchList && (
                        <div className="absolute bg-white border border-gray-300 mt-1 rounded shadow-lg w-full z-50">
                          {patientLoading ? (
                            <div>Loading...</div>
                          ) : filteredPatients.length > 0 ? (
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
                                  setSelectedUser(patient);
                                }}
                              >
                                {`${patient.user.firstName} ${patient.user.lastName} - ${patient.patientId}`}
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
            <div className="flex items-end w-full">
              <SubmitButton label="Search" />
            </div>
          </form>
        </Form>
        <TasksDialog
          tasksData={editData}
          onClose={handleEditDialogClose}
          isOpen={isDialogOpen}
        />
        {/* Results Table */}
        <div className="space-y-3">
          {dataLoading ? (
            <TableShimmer />
          ) : (
            resultList?.data && (
              <DefaultDataTable
                title="Tasks"
                onAddClick={() => {
                  setIsDialogOpen(true);
                }}
                columns={columns({
                  setEditData,
                  setIsCommentDialogOpen: () => {},
                  setIsEditDialogOpen: setIsDialogOpen,
                  setTaskLoading: setLoading,
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
            )
          )}
        </div>
      </div>
    </>
  );
};

export default ViewTasks;
