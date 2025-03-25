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
import { MultiSelectCheckbox } from "@/components/ui/multiselectDropdown";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

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
  // const [showDueDate, setShowDueDate] = useState<boolean>(false);
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
      owner: tasksData?.assignedProvider?.id ?? "",
      priority: tasksData?.priority ?? "low",
      dueDate: tasksData?.dueDate
        ? new Date(tasksData.dueDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      sendReminder: tasksData?.reminder ?? [],
      comments: tasksData?.description ?? "",
      assignDueDate: tasksData?.dueDate ? true : false,
    },
  });

  const showDueDate = form.watch("assignDueDate");

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
        form.setValue("assignDueDate", true);
      }

      if (tasksData?.assignerProvider?.id) {
        const matchingOwner = ownersList.find(
          (owner) =>
            owner.providerDetails?.id === tasksData.assignerProvider?.id
        );

        if (matchingOwner) {
          setSelectedOwner(matchingOwner);
          form.setValue("owner", matchingOwner.providerDetails?.id ?? "");
        }
      }
    } else {
      form.reset({
        category: "",
        task: "",
        owner: "",
        priority: "low",
        sendReminder: [],
        comments: "",
      });
    }
  }, [form, tasksData, ownersList]);

  const onSubmit = async (values: z.infer<typeof tasksSchema>) => {
    setTaskDataLoading(true);
    try {
      if (!tasksData) {
        if (values.dueDate) {
          const requestData: CreateTaskType = {
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
          await createTask({ requestBody: requestData });
        } else {
          const requestData: CreateTaskType = {
            category: values.category,
            description: values.comments ?? "",
            priority: values.priority,
            status: "PENDING",
            notes: values.task,
            reminder: values.sendReminder,
            assignedProviderId: selectedOwner?.providerDetails?.id ?? "",
            assignerProviderId: providerDetails.providerId,
            assignedByAdmin: true,
            userDetailsId: userDetailsId,
          };
          await createTask({ requestBody: requestData });
        }

        showToast({
          toast,
          type: "success",
          message: "Task created successfully",
        });
      } else {
        if (values.dueDate) {
          const requestData: UpdateTaskType = {
            category: values.category,
            description: values.comments ?? "",
            priority: values.priority,
            status: "PENDING",
            notes: values.task,
            reminder: values.sendReminder,
            assignedProviderId: selectedOwner?.providerDetails?.id ?? "",
            assignerProviderId: providerDetails.providerId,
            assignedByAdmin: true,
            userDetailsId: userDetailsId,
            dueDate: values.dueDate ? values.dueDate : "",
          };
          await updateTask({ requestData, id: tasksData.id });
        } else {
          const requestData: UpdateTaskType = {
            category: values.category,
            description: values.comments ?? "",
            priority: values.priority,
            status: "PENDING",
            notes: values.task,
            reminder: values.sendReminder,
            assignedProviderId: selectedOwner?.providerDetails?.id ?? "",
            assignerProviderId: providerDetails.providerId,
            assignedByAdmin: true,
            userDetailsId: userDetailsId,
          };
          await updateTask({ requestData, id: tasksData.id });
        }
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
      form.setValue("assignDueDate", false);
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
                                <SelectItem
                                  key={owner.id}
                                  value={owner.providerDetails?.id ?? owner.id}
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
                <div className="flex flex-col gap-3 border rounded-md p-2">
                  <Checkbox
                    id="assignDueDate"
                    checked={showDueDate}
                    onCheckedChange={(checked) =>
                      form.setValue("assignDueDate", checked)
                    }
                    label="Assign due date"
                  />
                  {showDueDate && (
                    <>
                      <div className="flex gap-4 flex-col flex-1 px-2">
                        <div className="flex flex-row gap-2">
                          <FormField
                            control={form.control}
                            name="dueDate"
                            render={({ field }) => (
                              <FormItem>
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
                                            field.onChange(date.toISOString());
                                          }
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
                              <FormItem>
                                <FormLabel>Select Reminder Days</FormLabel>
                                <MultiSelectCheckbox
                                  options={reminderOptions.map((option) => ({
                                    id: option,
                                    label: option,
                                  }))}
                                  onChange={(selectedValues: string[]) => {
                                    field.onChange(selectedValues);
                                  }}
                                  defaultSelected={field.value ?? []}
                                  className="flex-1 truncate"
                                />
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
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
