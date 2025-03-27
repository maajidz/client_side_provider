import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";
import { Button } from "@/components/ui/button";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { priority, reminderOptions } from "@/constants/data";
import { tasksSchema } from "@/schema/tasksSchema";
import { updateTask } from "@/services/chartDetailsServices";
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
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const EditPatientTaskDialog = ({
  tasksData,
  userDetailsId,
  isOpen,
  onClose,
  ownersList,
  onFetchTasks,
  tasksListData,
}: {
  tasksData?: TasksResponseDataInterface | null;
  userDetailsId: string;
  isOpen: boolean;
  onClose: () => void;
  ownersList: FetchProviderList[];
  onFetchTasks: (page: number, userDetailsId: string) => Promise<void>;
  tasksListData: TaskTypeResponse | null;
}) => {
  const [showDueDate, setShowDueDate] = useState(!!tasksData?.dueDate);
  const [selectedOwner, setSelectedOwner] = useState<FetchProviderList>();
  const [selectedTask, setSelectedTask] = useState<TaskTypeList>();
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const providerDetails = useSelector((state: RootState) => state.login);

  const form = useForm<z.infer<typeof tasksSchema>>({
    resolver: zodResolver(tasksSchema),
    defaultValues: {
      category: tasksData?.categoryId ?? "",
      task: tasksData?.notes ?? "",
      owner: tasksData?.assignedProvider?.id ?? "",
      priority: tasksData?.priority ?? "low",
      dueDate: tasksData?.dueDate
        ? new Date(tasksData.dueDate).toISOString().split("T")[0]
        : "N/A",
      sendReminder: [],
      comments: tasksData?.description ?? "",
      userDetailsId: tasksData?.userDetailsId ?? "",
    },
  });

  useEffect(() => {
    if (tasksData) {
      form.reset({
        category: tasksData.categoryId || "",
        task: tasksData.notes || "",
        owner: tasksData.assignerProvider?.id || "",
        dueDate: tasksData?.dueDate
          ? new Date(tasksData.dueDate).toISOString().split("T")[0]
          : "",
        priority: tasksData.priority || "low",
        sendReminder: tasksData.reminder || [],
        comments: tasksData.description || "",
        userDetailsId: tasksData.userDetailsId,
      });

      // Setting selected category
      const selectedTaskCategory = tasksListData?.taskTypes.find(
        (task) => task.id === tasksData.categoryId
      );
      setSelectedTask(selectedTaskCategory);

      // Setting selected owner
      const selectedTaskOwner = ownersList.find(
        (owner) => owner.providerDetails?.id === tasksData.assignerProvider?.id
      );
      setSelectedOwner(selectedTaskOwner);
      setShowDueDate(!!tasksData?.dueDate);
    }
  }, [form, tasksData, tasksListData, ownersList]);

  const onSubmit = async (values: z.infer<typeof tasksSchema>) => {
    setLoading(true);

    try {
      const requestData: UpdateTaskType = {
        categoryId: selectedTask?.id ?? "",
        description: values.comments ?? "",
        priority: values.priority,
        status: "PENDING",
        notes: values.task,
        reminder: values.sendReminder,
        assignedProviderId: selectedOwner?.providerDetails?.id ?? "",
        assignerProviderId: providerDetails.providerId,
        assignedByAdmin: true,
        userDetailsId: values?.userDetailsId ?? "",
      };

      if (tasksData?.dueDate) {
        const formattedDueDate = new Date(tasksData.dueDate)
          .toISOString()
          .split("T")[0];
        form.setValue("dueDate", formattedDueDate);
      }
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle asChild>Edit Patient Task</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5">
              <ScrollArea className="max-h-[90dvh] h-auto">
                <div className="flex flex-col gap-5">
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
                      <div className="flex flex-row gap-4 items-baseline justify-end">
                        {/* Due Date Field */}
                        <FormField
                          control={form.control}
                          name="dueDate"
                          render={({ field }) => (
                            <FormItem className="flex gap-2">
                              <FormLabel>From Date:</FormLabel>
                              <FormControl>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "justify-start text-left font-normal",
                                        !field.value && "text-muted-foreground"
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
                  label={loading ? "Updating..." : "Update"}
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

export default EditPatientTaskDialog;
