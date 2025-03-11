import React, { useState, useCallback, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
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
  SelectItem,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { tasksSchema } from "@/schema/tasksSchema";
import {
  CreateTaskType,
  TasksResponseDataInterface,
  UpdateTaskType,
} from "@/types/tasksInterface";
import { createTask, updateTask } from "@/services/chartDetailsServices";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { FetchProviderList } from "@/types/providerDetailsInterface";
import { categoryOptions, priority, reminderOptions } from "@/constants/data";
import { fetchProviderListDetails } from "@/services/registerServices";
import { useToast } from "@/hooks/use-toast";
import { showToast } from "@/utils/utils";
import { UserData } from "@/types/userInterface";
import { fetchUserDataResponse } from "@/services/userServices";
import SubmitButton from "../custom_buttons/buttons/SubmitButton";
import { ScrollArea } from "../ui/scroll-area";
import formStyles from "@/components/formStyles.module.css";
import { Button } from "../ui/button";

const TasksDialog = ({
  tasksData,
  onClose,
  isOpen,
}: {
  tasksData?: TasksResponseDataInterface | null;
  onClose: () => void;
  isOpen: boolean;
}) => {
  const [patients, setPatients] = useState<UserData[]>([]);
  const [showPatientSpecific, setShowPatientSpecific] =
    useState<boolean>(false);
  const [showDueDate, setShowDueDate] = useState(false);
  const [ownersList, setOwnersList] = useState<FetchProviderList[]>([]);
  const [selectedOwner, setSelectedOwner] = useState<FetchProviderList>();
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleSearchList, setVisibleSearchList] = useState<boolean>(false);
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);

  const providerDetails = useSelector((state: RootState) => state.login);

  const form = useForm<z.infer<typeof tasksSchema>>({
    resolver: zodResolver(tasksSchema),
    defaultValues: {
      category: "",
      task: "",
      owner: "",
      priority: "low",
      dueDate: "",
      sendReminder: [],
      comments: "",
      userDetailsId: "",
    },
  });

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

  useEffect(() => {
    fetchOwnersList();
    fetchPatientList();
  }, [fetchOwnersList, fetchPatientList]);

  useEffect(() => {
    if (tasksData) {
      form.reset({
        category: tasksData.categoryId || "",
        task: tasksData.notes || "",
        owner: tasksData?.assignerProvider?.id || "",
        priority: tasksData.priority || "low",
        sendReminder: tasksData.reminder || [],
        comments: tasksData.description || "",
        userDetailsId: tasksData.userDetailsId,
      });
      if (tasksData.dueDate) {
        const formattedDueDate = new Date(tasksData.dueDate)
          .toISOString()
          .split("T")[0];
        form.setValue("dueDate", formattedDueDate);
        setShowDueDate(!!tasksData.dueDate);
      }
      setShowPatientSpecific(!!tasksData.userDetailsId);
      setSelectedOwner(
        ownersList.find((owner) => owner.id === tasksData.assignerProvider?.id)
      );
    }
  }, [form, tasksData, ownersList]);

  const onSubmit = async (values: z.infer<typeof tasksSchema>) => {
    setLoading(true);
    try {
      const requestData: CreateTaskType | UpdateTaskType = {
        category: values.category,
        description: values.comments ?? "",
        priority: values.priority,
        status: "PENDING",
        notes: values.task,
        dueDate: `${values.dueDate}`,
        assignedProviderId: selectedOwner?.providerDetails?.id ?? "",
        assignerProviderId: providerDetails.providerId,
        assignedByAdmin: true,
        userDetailsId: values?.userDetailsId ?? "",
        reminder: values?.sendReminder,
      };
      if (!tasksData) {
        await createTask({ requestBody: requestData });
        showToast({
          toast,
          type: "success",
          message: "Task created successfully",
        });
      } else {
        await updateTask({ requestData, id: tasksData.id });
        showToast({
          toast,
          type: "success",
          message: "Task updated successfully",
        });
      }
    } catch (err) {
      console.log(err);
      showToast({
        toast,
        type: "error",
        message: "Task creation failed",
      });
    } finally {
      setLoading(false);
      form.reset();
      onClose();
    }
  };

  const filteredPatients = patients.filter((patient) =>
    `${patient.user.firstName} ${patient.user.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{tasksData ? "Edit Task" : "Add Task"}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5">
              <ScrollArea className="h-96">
                <div className="flex flex-col gap-5 p-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem className={formStyles.formItem}>
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
                              {loading ? (
                                <div>Loading...</div>
                              ) : (
                                categoryOptions.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
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
                  <FormField
                    control={form.control}
                    name="task"
                    render={({ field }) => (
                      <FormItem className={formStyles.formItem}>
                        <FormLabel>Task</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="owner"
                    render={({ field }) => (
                      <FormItem className={formStyles.formItem}>
                        <FormLabel className="w-fit">Owner</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              const selected = ownersList.find(
                                (owner) => owner.id === value
                              );
                              setSelectedOwner(selected);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Owner" />
                            </SelectTrigger>
                            <SelectContent>
                              {loading ? (
                                <div>Loading...</div>
                              ) : (
                                ownersList.map((owner) => (
                                  <SelectItem key={owner.id} value={owner.id}>
                                    {owner.firstName} {owner.lastName}
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
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem className={formStyles.formItem}>
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

                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="isPatientSpecific"
                      onCheckedChange={() =>
                        setShowPatientSpecific(!showPatientSpecific)
                      }
                    />
                    <label
                      htmlFor="isPatientSpecific"
                      className="text-sm font-medium"
                    >
                      Is patient specific
                    </label>
                  </div>

                  {showPatientSpecific && (
                    <>
                      <FormField
                        control={form.control}
                        name="userDetailsId"
                        render={({ field }) => (
                          <FormItem className={formStyles.formItem}>
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
                                    {loading ? (
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
                                          }}
                                        >
                                          {`${patient.user.firstName} ${patient.user.lastName}`}
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
                    </>
                  )}

                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="assignDueDate"
                      onCheckedChange={() => setShowDueDate(!showDueDate)}
                    />
                    <label
                      htmlFor="assignDueDate"
                      className="text-sm font-medium"
                    >
                      Assign due date
                    </label>
                  </div>

                  {showDueDate && (
                    <>
                      <div className="space-y-4 border-t pt-4">
                        <h4 className="text-lg font-semibold">
                          Date and Reminder Settings
                        </h4>
                        <div className="flex flex-row">
                          <FormField
                            control={form.control}
                            name="dueDate"
                            render={({ field }) => (
                              <FormItem className={formStyles.formItem}>
                                <FormLabel>From Date:</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="sendReminder"
                            render={({ field }) => (
                              <FormItem className={formStyles.formItem}>
                                <FormLabel>Send Reminder Mail</FormLabel>
                                {reminderOptions.map((option) => (
                                  <div
                                    key={option}
                                    className="flex items-center space-x-3"
                                  >
                                    <Checkbox
                                      id={option}
                                      checked={field.value?.includes(option)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...(field.value || []),
                                              option,
                                            ])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== option
                                              )
                                            );
                                      }}
                                    />
                                    <label
                                      htmlFor={option}
                                      className="text-sm font-medium"
                                    >
                                      {option}
                                    </label>
                                  </div>
                                ))}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </>
                  )}
                  <FormField
                    control={form.control}
                    name="comments"
                    render={({ field }) => (
                      <FormItem className={formStyles.formItem}>
                        <FormLabel>Comments</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </ScrollArea>
              <div className="flex gap-3 justify-between w-full">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                  className="w-full"
                >
                  Cancel
                </Button>
                <SubmitButton label={tasksData ? "Update" : "Create"} />
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TasksDialog;
