import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { tasksSchema } from "@/schema/tasksSchema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useCallback, useEffect, useState } from "react";
import {
  CreateTaskType,
  TasksResponseDataInterface,
  TaskTypeResponse,
  UpdateTaskType,
} from "@/types/tasksInterface";
import { createTask, updateTask } from "@/services/chartDetailsServices";
import { showToast } from "@/utils/utils";
import { FetchProviderList } from "@/types/providerDetailsInterface";
import { priority } from "@/constants/data";
import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchProviderListDetails } from "@/services/registerServices";

function TasksDialog({
  isOpen,
  userDetailsId,
  tasksData,
  onClose,
  tasksListData,
}: {
  isOpen: boolean;
  userDetailsId: string;
  tasksData?: TasksResponseDataInterface | null;
  onClose: () => void;
  tasksListData: TaskTypeResponse | null;
}) {
  const [showDueDate, setShowDueDate] = useState<boolean>(false);
  const [taskDataLoading, setTaskDataLoading] = useState<boolean>(false);
  const [ownersList, setOwnersList] = useState<FetchProviderList[]>([]);
  const [selectedOwner, setSelectedOwner] = useState<FetchProviderList>();

  const [loading, setLoading] = useState<boolean>(false);

  const { toast } = useToast();

  const providerDetails = useSelector((state: RootState) => state.login);

  const reminderOptions = [
    "On Due Date",
    "1 Day Before",
    "2 Days Before",
    "3 Days Before",
  ];

  const form = useForm<z.infer<typeof tasksSchema>>({
    resolver: zodResolver(tasksSchema),
    defaultValues: {
      category: tasksData?.categoryId ?? "",
      task: tasksData?.notes ?? "",
      owner: tasksData?.assignedProvider.id ?? "",
      priority: tasksData?.priority ?? "low",
      dueDate: tasksData?.dueDate ?? new Date().toISOString().split("T")[0],
      sendReminder: [],
      comments: tasksData?.description ?? "",
    },
  });

  const fetchOwnersList = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetchProviderListDetails({ page: 1, limit: 10 });

      if (response) {
        setOwnersList(response.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOwnersList();
  }, [fetchOwnersList]);

  useEffect(() => {
    if (tasksData) {
      form.reset({
        category: tasksData.categoryId ?? "",
        task: tasksData.notes ?? "",
        owner: tasksData.id ?? "",
        priority: tasksData?.priority ?? "low",
        sendReminder: tasksData?.reminder ?? [],
        comments: tasksData.notes,
      });
      if (tasksData.dueDate) {
        const formattedDueDate = new Date(tasksData.dueDate)
          .toISOString()
          .split("T")[0];
        form.setValue("dueDate", formattedDueDate);
        setShowDueDate(!showDueDate);
      }
      setSelectedOwner(
        ownersList.find((owner) => owner.providerDetails?.id === tasksData.assignerProvider?.id)
      );
      form.setValue("owner", selectedOwner?.providerDetails?.id ?? "")
    } else {
      form.reset({
        category:  "",
        task: "",
        owner:  "",
        priority: "low",
        sendReminder: [],
        comments: "",
      });
    }
  }, [form, tasksData, ownersList, selectedOwner?.providerDetails?.id, setShowDueDate, showDueDate]);

  const onSubmit = async (values: z.infer<typeof tasksSchema>) => {
    const requestData: CreateTaskType | UpdateTaskType = {
      category: values.category,
      description: values.comments ?? "",
      priority: values.priority,
      status: "PENDING",
      notes: values.task,
      dueDate: `${values.dueDate}`,
      reminder: values.sendReminder,
      assignedProviderId: selectedOwner?.providerDetails?.id ?? "",
      assignerProviderId: providerDetails.providerId,
      assignedByAdmin: true,
      userDetailsId: userDetailsId,
    };

    setTaskDataLoading(true);
    try {
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
      console.log("Error", err);
      showToast({
        toast,
        type: "error",
        message: "Task creation failed",
      });
    } finally {
      onClose();
      setTaskDataLoading(false);
      setShowDueDate(false);
      form.reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{tasksData ? "Edit Task" : "Add Task"}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[90dvh] h-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
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
                />
                <FormField
                  control={form.control}
                  name="task"
                  render={({ field }) => (
                    <FormItem className="">
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
                    <FormItem className="">
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
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Owner" />
                          </SelectTrigger>
                          <SelectContent>
                            {loading ? (
                              <div> Loading...</div>
                            ) : (
                              ownersList.map((owner) => (
                                <SelectItem key={owner.id} value={owner.providerDetails?.id ?? owner.id}>
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
                    <FormItem className="">
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
                            {priority.map((priorityItem) => (
                              <SelectItem
                                key={priorityItem}
                                value={priorityItem}
                              >
                                {priorityItem}
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
                    <div className="flex gap-4 flex-col flex-1">
                      <h4 className="text-lg font-semibold">
                        Date and Reminder
                      </h4>
                      <div className="flex flex-row gap-2">
                        <FormField
                          control={form.control}
                          name="dueDate"
                          render={({ field }) => (
                            <FormItem>
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
                          render={({ field }) => {
                            const selectedValues = field.value ?? [];
                            return (
                              <FormItem>
                                <FormLabel>Send Reminder Mail</FormLabel>
                                <Select>
                                  <SelectTrigger className="w-full max-w-full">
                                    <SelectValue
                                      placeholder={
                                        selectedValues.length > 0
                                          ? selectedValues.join(", ")
                                          : "Select Reminder Day"
                                      }
                                    />
                                  </SelectTrigger>
                                  <SelectContent className="pt-1 pb-1">
                                    {reminderOptions.map((option) => (
                                      <div
                                        key={option}
                                        className="text-sm font-medium rounded-md hover:bg-gray-100 flex items-center gap-2 p-2 cursor-pointer"
                                        onClick={() => {
                                          const updatedValues =
                                            selectedValues.includes(option)
                                              ? selectedValues.filter(
                                                  (val) => val !== option
                                                )
                                              : [...selectedValues, option];

                                          field.onChange(updatedValues);
                                        }}
                                      >
                                        <Checkbox
                                          checked={selectedValues.includes(
                                            option
                                          )}
                                        />
                                        {option}
                                      </div>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        />
                      </div>
                    </div>
                  </>
                )}
                <FormField
                  control={form.control}
                  name="comments"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>Comments</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <SubmitButton
                  label={taskDataLoading ? "Adding..." : "Add"}
                  disabled={taskDataLoading}
                />
              </div>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default TasksDialog;
