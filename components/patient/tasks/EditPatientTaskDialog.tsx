import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";
import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { priority, reminderOptions } from "@/constants/data";
import { tasksSchema } from "@/schema/tasksSchema";
import { getTasksTypes, updateTask } from "@/services/chartDetailsServices";
import { fetchProviderListDetails } from "@/services/registerServices";
import { FetchProviderList } from "@/types/providerDetailsInterface";
import {
  TasksResponseDataInterface,
  TaskTypeList,
  TaskTypeResponse,
  UpdateTaskType,
} from "@/types/tasksInterface";
import { RootState } from "@/store/store";
import { showToast } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";

const EditPatientTaskDialog = ({
  tasksData,
  userDetailsId,
  isOpen,
  onClose,
  onFetchTasks,
}: {
  tasksData?: TasksResponseDataInterface | null;
  userDetailsId: string;
  isOpen: boolean;
  onClose: () => void;
  onFetchTasks: (page: number, userDetailsId: string) => Promise<void>;
}) => {
  const [showDueDate, setShowDueDate] = useState(false);
  const [ownersList, setOwnersList] = useState<FetchProviderList[]>([]);
  const [tasksListData, setTasksListData] = useState<TaskTypeResponse>();
  const [selectedOwner, setSelectedOwner] = useState<FetchProviderList>();
  const [selectedTask, setSelectedTask] = useState<TaskTypeList>();
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const providerDetails = useSelector((state: RootState) => state.login);

  const form = useForm<z.infer<typeof tasksSchema>>({
    resolver: zodResolver(tasksSchema),
    defaultValues: {
      category: tasksData?.category ?? "",
      task: tasksData?.notes ?? "",
      owner: tasksData?.assignedProvider?.id ?? "",
      priority: tasksData?.priority ?? "low",
      dueDate: "",
      sendReminder: [],
      comments: tasksData?.description ?? "",
      userDetailsId: tasksData?.userDetailsId ?? "",
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

  useEffect(() => {
    fetchOwnersList();
  }, [fetchOwnersList, fetchTasksList]);

  useEffect(() => {
    if (tasksData) {
      form.reset({
        category: tasksData.category || "",
        task: tasksData.notes || "",
        owner: tasksData.assignerProvider?.id || "",
        priority: tasksData.priority || "low",
        sendReminder: tasksData.reminder || [],
        comments: tasksData.description || "",
        userDetailsId: tasksData.userDetailsId,
      });

      // Setting selected category
      const selectedTaskCategory = tasksListData?.taskTypes.find(
        (task) => task.id === tasksData.category
      );
      setSelectedTask(selectedTaskCategory);

      // Setting selected owner
      const selectedTaskOwner = ownersList.find(
        (owner) => owner.providerDetails?.id === tasksData.assignerProvider?.id
      );
      setSelectedOwner(selectedTaskOwner);
    }
  }, [form, tasksData, tasksListData, ownersList]);

  // useEffect(() => {
  //   if (tasksData) {
  //     form.reset({
  //       category: tasksData.category,
  //       task: tasksData.notes,
  //       owner: tasksData?.assignerProvider?.id,
  //       priority: tasksData.priority,
  //       sendReminder: tasksData?.reminder,
  //       comments: tasksData.description,
  //       userDetailsId: tasksData.userDetailsId,
  //     });
  //     if (tasksData.dueDate) {
  //       const formattedDueDate = new Date(tasksData.dueDate)
  //         .toISOString()
  //         .split("T")[0];
  //       form.setValue("dueDate", formattedDueDate);
  //       setShowDueDate(!!tasksData.dueDate);
  //     }

  //     setSelectedOwner(
  //       ownersList.find(
  //         (owner) =>
  //           owner.providerDetails?.id === tasksData.assignerProvider?.id
  //       )
  //     );
  //     setSelectedTask(
  //       tasksListData?.taskTypes.find((task) => task.id === tasksData.category)
  //     );
  //     console.log("Fetched", tasksData.assignerProvider?.id);
  //     console.log("Set", form.getValues().owner);
  //   }
  // }, [form, tasksData, ownersList, selectedTask, tasksListData]);

  const onSubmit = async (values: z.infer<typeof tasksSchema>) => {
    setLoading(true);

    try {
      const requestData: UpdateTaskType = {
        category: selectedTask?.id ?? "",
        description: values.comments ?? "",
        priority: values.priority,
        status: "PENDING",
        notes: values.task,
        dueDate: `${values.dueDate}`,
        reminder: values.sendReminder,
        assignedProviderId: selectedOwner?.providerDetails?.id ?? "",
        assignerProviderId: providerDetails.providerId,
        assignedByAdmin: true,
        userDetailsId: values?.userDetailsId ?? "",
      };
      if (tasksData) {
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
        message: "Task update failed",
      });
    } finally {
      setLoading(false);
      form.reset();
      onClose();
      await onFetchTasks(1, userDetailsId);
    }
  };

  if (loading) {
    return <LoadingButton />;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Patient Task</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5">
              <ScrollArea className="max-h-[90dvh] h-auto">
                <div className="flex flex-col gap-5">
                  {/* <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="w-fit">Category</FormLabel>
                        <FormControl>
                          <Select
                            defaultValue={field.value}
                            onValueChange={(value) => {
                              field.onChange(value);
                              const selected = tasksListData?.taskTypes.find(
                                (category) => category.id === value
                              );
                              setSelectedTask(selected);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choose Category" />
                            </SelectTrigger>
                            <SelectContent>
                              {tasksListData && tasksListData?.taskTypes ? (
                                tasksListData?.taskTypes.map((category) => (
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
                  /> */}
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="w-fit">Category</FormLabel>
                        <FormControl>
                          <Select
                            defaultValue={field.value}
                            value={field.value}
                            onValueChange={(value) => {
                              field.onChange(value);
                              const selected = tasksListData?.taskTypes.find(
                                (category) => category.id === value
                              );
                              setSelectedTask(selected);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choose Category" />
                            </SelectTrigger>
                            <SelectContent>
                              {tasksListData && tasksListData.taskTypes ? (
                                tasksListData?.taskTypes.map((category) => (
                                  <SelectItem
                                    key={category.id}
                                    value={category.id}
                                  >
                                    {category.name}
                                  </SelectItem>
                                ))
                              ) : (
                                <div>No Tasks found</div>
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
                      <FormItem>
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
                      <FormItem>
                        <FormLabel className="w-fit">Owner</FormLabel>
                        <FormControl>
                          <Select
                            defaultValue={field.value}
                            onValueChange={(value) => {
                              field.onChange(value);
                              const selected = ownersList.find(
                                (owner) => owner.providerDetails?.id === value
                              );
                              setSelectedOwner(selected);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Owner" />
                            </SelectTrigger>
                            <SelectContent>
                              {ownersList.map((owner) => (
                                <SelectItem
                                  key={owner.id}
                                  value={owner.providerDetails?.id || owner.id}
                                >
                                  {owner.firstName} {owner.lastName}
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
                    <div className="space-y-4 border-t pt-4">
                      <h4 className="text-lg font-semibold">
                        Date and Reminder Settings
                      </h4>

                      {/* Due Date Field */}
                      <FormField
                        control={form.control}
                        name="dueDate"
                        render={({ field }) => (
                          <FormItem className="flex gap-2 items-center">
                            <FormLabel>From Date:</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Reminder Selection */}
                      <FormField
                        control={form.control}
                        name="sendReminder"
                        render={({ field }) => {
                          const selectedValues: string[] = field.value || [];

                          return (
                            <FormItem>
                              <FormLabel>Send Reminder Mail</FormLabel>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue
                                    placeholder={
                                      selectedValues.length > 0
                                        ? selectedValues.join(", ")
                                        : "Select Reminder Day"
                                    }
                                  />
                                </SelectTrigger>
                                <SelectContent className="p-2">
                                  {reminderOptions.map((option) => {
                                    const isSelected =
                                      selectedValues.includes(option);

                                    return (
                                      <div
                                        key={option}
                                        className="flex items-center gap-2 p-2 cursor-pointer"
                                        onClick={() => {
                                          // Toggle selection
                                          const updatedValues = isSelected
                                            ? selectedValues.filter(
                                                (val) => val !== option
                                              )
                                            : [...selectedValues, option];

                                          field.onChange(updatedValues);
                                        }}
                                      >
                                        <Checkbox checked={isSelected} />
                                        {option}
                                      </div>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                    </div>
                  )}

                  <FormField
                    control={form.control}
                    name="comments"
                    render={({ field }) => (
                      <FormItem>
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
                <SubmitButton
                  label={"Update"}
                  onClick={() => console.log(form.getValues())}
                />
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPatientTaskDialog;
