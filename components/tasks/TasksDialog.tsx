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
  TaskTypeList,
  UpdateTaskType,
} from "@/types/tasksInterface";
import {
  createTask,
  getTasksTypes,
  updateTask,
} from "@/services/chartDetailsServices";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { FetchProviderList } from "@/types/providerDetailsInterface";
import { priority, reminderOptions } from "@/constants/data";
import { fetchProviderListDetails } from "@/services/registerServices";
import { useToast } from "@/hooks/use-toast";
import { showToast } from "@/utils/utils";
import { UserData } from "@/types/userInterface";
import { fetchUserDataResponse } from "@/services/userServices";
import SubmitButton from "../custom_buttons/buttons/SubmitButton";
import { ScrollArea } from "../ui/scroll-area";
import formStyles from "@/components/formStyles.module.css";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";

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
  const [showDueDate, setShowDueDate] = useState(!!tasksData?.dueDate);
  const [ownersList, setOwnersList] = useState<FetchProviderList[]>([]);
  const [selectedOwner, setSelectedOwner] = useState<FetchProviderList>();
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleSearchList, setVisibleSearchList] = useState<boolean>(false);
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  // Task Types List Data State
  const [taskTypes, setTaskTypes] = useState<TaskTypeList[]>([]);

  const providerDetails = useSelector((state: RootState) => state.login);

  const form = useForm<z.infer<typeof tasksSchema>>({
    resolver: zodResolver(tasksSchema),
    defaultValues: {
      category: "",
      task: "",
      owner: "",
      priority: "low",
      dueDate: tasksData?.dueDate
        ? new Date(tasksData.dueDate).toISOString().split("T")[0]
        : "N/A",
      sendReminder: [],
      comments: "",
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
    fetchTaskTypes();
    fetchOwnersList();
    fetchPatientList();
  }, [fetchTaskTypes, fetchOwnersList, fetchPatientList]);

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
      }
      setShowDueDate(!!tasksData?.dueDate);
      setShowPatientSpecific(!!tasksData.userDetailsId);
      setSelectedOwner(
        ownersList.find((owner) => owner.id === tasksData.assignerProvider?.id)
      );
    }
  }, [form, tasksData, ownersList]);

  const onSubmit = async (values: z.infer<typeof tasksSchema>) => {
    setLoading(true);
    console.log(values.category, 'IDIDIDIIDIID');
    try {
      const requestData: CreateTaskType | UpdateTaskType = {
        categoryId: values.category,
        description: values.comments ?? "",
        priority: values.priority,
        status: "PENDING",
        notes: values.task,
        assignedProviderId: selectedOwner?.providerDetails?.id ?? "",
        assignerProviderId: providerDetails.providerId,
        assignedByAdmin: true,
        userDetailsId: values?.userDetailsId ?? "",
        reminder: values?.sendReminder,
      };

      if (tasksData?.dueDate) {
        const formattedDueDate = new Date(tasksData.dueDate)
          .toISOString()
          .split("T")[0];
        form.setValue("dueDate", formattedDueDate);
      }
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

  const todayClass = "w-full bg-[#84012A] text-[#84012A] ";
  const selectedClass =
    "w-full bg-[#84012A] text-white rounded-2xl hover:bg-[#84012A] hover:text-white";
  const defaultClass = "w-full bg-white text-black";

  const isToday = (date: Date | undefined) => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date | undefined) => {
    return date?.getTime() === (date?.getTime() || 0);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        onClose();
        form.reset();
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle asChild>{tasksData ? "Edit Task" : "Add Task"}</DialogTitle>
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
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choose Category" />
                            </SelectTrigger>
                            <SelectContent>
                              {taskTypes ? (
                                taskTypes.map((category) => (
                                  <SelectItem
                                    key={category.id}
                                    value={category.id}
                                  >
                                    {category.name}
                                  </SelectItem>
                                ))
                              ) : (
                                <div>No Tasks Found</div>
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
                                (owner) => owner.providerDetails?.id === value
                              );
                              setSelectedOwner(selected);
                            }}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Owner" />
                            </SelectTrigger>
                            <SelectContent>
                              {loading ? (
                                <div>Loading...</div>
                              ) : (
                                ownersList.map((owner) => (
                                  <SelectItem
                                    key={owner.id}
                                    value={
                                      owner.providerDetails?.id ?? owner.id
                                    }
                                  >
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
                      checked={showDueDate}
                      onCheckedChange={(checked) =>
                        setShowDueDate(Boolean(checked))
                      }
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
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant={"outline"}
                                        className={cn(
                                          "justify-start text-left font-normal",
                                          !field.value &&
                                            "text-muted-foreground"
                                        )}
                                      >
                                        <CalendarIcon />
                                        {field.value
                                          ? format(new Date(field.value), "PPP")
                                          : "Select a date"}
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 pointer-events-auto">
                                      <Calendar
                                        mode="single"
                                        selected={
                                          field.value
                                            ? new Date(field.value)
                                            : undefined
                                        }
                                        onSelect={(date) => {
                                          if (date) {
                                            field.onChange(
                                              format(date, "yyyy-MM-dd")
                                            );
                                          }
                                        }}
                                        classNames={{
                                          months: "relative pt-10",
                                          nav: "absolute top-0 left-1/2 transform -translate-x-1/2 w-1/2 p-3.5",
                                          month_caption:
                                            "absolute -top-3.5 left-1/2 transform -translate-x-1/2 pt-3.5",
                                          day_today: isToday(
                                            new Date(field.value ?? "")
                                          )
                                            ? todayClass
                                            : defaultClass,
                                          day_selected: isSelected(
                                            new Date(field.value ?? "")
                                          )
                                            ? selectedClass
                                            : defaultClass,
                                          month: "font-medium text-[#344054]",
                                          head_row: "",
                                          row: "",
                                          day: "",
                                          day_button:
                                            "w-full h-full p-4 items-center justify-center hover:bg-gray-100 rounded-md",
                                          today: "bg-blue-50 p-0 rounded-md",
                                          selected:
                                            "bg-[#84012A] text-white rounded-2xl",
                                          nav_button: "row-reverse",
                                          outside: "text-gray-400",
                                          disabled: "text-gray-300",
                                          day_range_start: "bg-green-200",
                                          day_range_end: "bg-red-200",
                                          day_range_middle: "bg-yellow-200",
                                        }}
                                      />
                                    </PopoverContent>
                                  </Popover>
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
              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    onClose();
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <SubmitButton
                  label={tasksData ? "Update" : "Add"}
                  disabled={loading}
                />
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TasksDialog;
