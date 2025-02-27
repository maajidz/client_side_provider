import { zodResolver } from "@hookform/resolvers/zod";
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
import LoadingButton from "@/components/LoadingButton";
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
  UpdateTaskType,
} from "@/types/tasksInterface";
import { createTask, updateTask } from "@/services/chartDetailsServices";
import { fetchProviderListDetails } from "@/services/registerServices";
import { showToast } from "@/utils/utils";
import { FetchProviderList } from "@/types/providerDetailsInterface";
import { categoryOptions, priority, reminderOptions } from "@/constants/data";
import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";
import { ScrollArea } from "@/components/ui/scroll-area";

function TasksDialog({
  isOpen,
  userDetailsId,
  tasksData,
  onClose,
}: {
  isOpen: boolean;
  userDetailsId: string;
  tasksData?: TasksResponseDataInterface | null;
  onClose: () => void;
}) {
  const [showDueDate, setShowDueDate] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [ownersList, setOwnersList] = useState<FetchProviderList[]>([]);
  const [selectedOwner, setSelectedOwner] = useState<FetchProviderList>();

  const { toast } = useToast();

  const providerDetails = useSelector((state: RootState) => state.login);

  const form = useForm<z.infer<typeof tasksSchema>>({
    resolver: zodResolver(tasksSchema),
    defaultValues: {
      category: "",
      task: "",
      owner: "",
      priority: "low",
      dueDate: new Date().toISOString().split("T")[0],
      sendReminder: [],
      comments: "",
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
        category: tasksData.category ?? "",
        task: tasksData.notes ?? "",
        owner: tasksData.id ?? "",
        priority: tasksData?.priority ?? "low",
        sendReminder: [],
        comments: tasksData.notes,
      });
      if (tasksData.dueDate) {
        const formattedDueDate = new Date(tasksData.dueDate)
          .toISOString()
          .split("T")[0];
        form.setValue("dueDate", formattedDueDate);
        setShowDueDate(!!tasksData.dueDate);
      }
      setSelectedOwner(
        ownersList.find((owner) => owner.id === tasksData.assignerProvider?.id)
      );
    }
  }, [form, tasksData, ownersList]);

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

    setLoading(true);
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
      setLoading(false);
      setShowDueDate(false);
      form.reset();
    }
  };

  if (loading) {
    return <LoadingButton />;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{tasksData ? "Edit Task" : "Add Task"}</DialogTitle>
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
                              (owner) => owner.id === value
                            );
                            setSelectedOwner(selected);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Owner" />
                          </SelectTrigger>
                          <SelectContent>
                            {ownersList.map((owner) => (
                              <SelectItem key={owner.id} value={owner.id}>
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
                    onCheckedChange={(checked) =>
                      setShowDueDate(checked as boolean)
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
                        Date and Reminder
                      </h4>
                      <div className="flex flex-row gap-2">
                      <FormField
                        control={form.control}
                        name="dueDate"
                        render={({ field }) => (
                          <FormItem className="">
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
                                  {reminderOptions.map((option) => (
                                    <div
                                      key={option}
                                      className="flex items-center gap-2 p-2 cursor-pointer"
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
                <SubmitButton label="Add" />
              </div>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default TasksDialog;
