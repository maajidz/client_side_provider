import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogTrigger,
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
import { Edit2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useCallback, useEffect, useState } from "react";
import {
  TasksResponseDataInterface,
  UpdateTaskType,
} from "@/types/tasksInterface";
import { updateTask } from "@/services/chartDetailsServices";
import { UserEncounterData } from "@/types/chartsInterface";
import { fetchProviderListDetails } from "@/services/registerServices";
import { showToast } from "@/utils/utils";
import { FetchProviderList } from "@/types/providerDetailsInterface";
import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
};

function EditTask({
  patientDetails,
  selectedTask,
  onFetchTasks,
}: {
  patientDetails: UserEncounterData;
  selectedTask: TasksResponseDataInterface;
  onFetchTasks: () => Promise<void>;
}) {
  const [showDueDate, setShowDueDate] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [ownersList, setOwnersList] = useState<FetchProviderList[]>([]);
  const [selectedOwner, setSelectedOwner] = useState<FetchProviderList>();

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
      category: selectedTask.category ?? "",
      task: selectedTask.notes ?? "",
      owner: selectedTask.id ?? "",
      priority: selectedTask?.priority ?? "low",
      dueDate:
        formatDate(selectedTask.dueDate) ??
        new Date().toISOString().split("T")[0],
      sendReminder: [],
      comments: selectedTask.notes,
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

  const onSubmit = async (values: z.infer<typeof tasksSchema>) => {
    const requestData: UpdateTaskType = {
      category: values.category ?? "",
      description: values.comments ?? "",
      status: "PENDING",
      priority: values.priority,
      notes: values.task,
      dueDate: `${values.dueDate}`,
      assignedProviderId: selectedOwner?.providerDetails?.id ?? "",
      assignerProviderId: providerDetails.providerId,
      assignedByAdmin: true,
      userDetailsId: patientDetails.userDetails.id,
    };

    setLoading(true);
    try {
      await updateTask({ requestData, id: selectedTask.id });

      showToast({
        toast,
        type: "success",
        message: "Task updated successfully",
      });
    } catch (err) {
      if (err instanceof Error) {
        showToast({
          toast,
          type: "error",
          message: "Could not update task",
        });
      }
    } finally {
      await onFetchTasks();
      setLoading(false);
      form.reset();
    }
  };

  if (loading) {
    return <LoadingButton />;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Edit2Icon color="#84012A" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="flex gap-2 items-center">
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
                          <SelectItem value="ancillary_appointments">
                            Ancillary Appointments
                          </SelectItem>
                          <SelectItem value="appointment">
                            Appointment
                          </SelectItem>
                          <SelectItem value="billing">Billing</SelectItem>
                          <SelectItem value="cancel_subscription">
                            Cancel Subscription
                          </SelectItem>
                          <SelectItem value="follow_up">Follow Up</SelectItem>
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
                  <FormItem className="flex gap-2 items-center">
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
                  <FormItem className="flex gap-2 items-center">
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
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
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
                <label htmlFor="assignDueDate" className="text-sm font-medium">
                  Assign due date
                </label>
              </div>

              {showDueDate && (
                <>
                  <div className="space-y-4 border-t pt-4">
                    <h4 className="text-lg font-semibold">
                      Date and Reminder Settings
                    </h4>
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
                    <FormField
                      control={form.control}
                      name="sendReminder"
                      render={({ field }) => (
                        <FormItem>
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
                </>
              )}
              <FormField
                control={form.control}
                name="comments"
                render={({ field }) => (
                  <FormItem className="flex gap-2 items-center">
                    <FormLabel>Comments</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <SubmitButton label="Save" />
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditTask;
