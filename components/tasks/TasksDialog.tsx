import React, { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { CreateTaskType, TasksResponseDataInterface } from "@/types/tasksInterface";
import { createTask } from "@/services/chartDetailsServices";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { FetchProviderList } from "@/types/providerDetailsInterface";
import { priority, reminderOptions } from "@/constants/data";
import { fetchProviderListDetails } from "@/services/registerServices";
import { useToast } from "@/components/ui/use-toast";
import { showToast } from "@/utils/utils";
import LoadingButton from "@/components/LoadingButton";

const TasksDialog = ({
  tasksData,
  onClose,
  isOpen,
}: {
  tasksData?: TasksResponseDataInterface | null;
  onClose: () => void;
  isOpen: boolean;
}) => {
  const [showPatientSpecific, setShowPatientSpecific] = useState(false);
  const [showDueDate, setShowDueDate] = useState(false);
  const [ownersList, setOwnersList] = useState<FetchProviderList[]>([]);
  const [selectedOwner, setSelectedOwner] = useState<FetchProviderList>();
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleSearchList, setVisibleSearchList] = useState<boolean>(false);
  const { toast } = useToast();

  const [loading, setLoading] = useState<boolean>(false);

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

  const [patients] = useState([
    "John Doe",
    "Jane Smith",
    "Emily Davis",
    "David Johnson",
  ]);

  const filteredPatients = patients.filter((patient) =>
    patient.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const providerDetails = useSelector((state: RootState) => state.login);

  const form = useForm<z.infer<typeof tasksSchema>>({
    resolver: zodResolver(tasksSchema),
    defaultValues: {
      category: "",
      task: "",
      owner: "",
      priority: "Low",
      dueDate: new Date().toISOString().split("T")[0],
      sendReminder: [],
      comments: "",
      userDetailsId: "97f41397-3fe3-4f0b-a242-d3370063db33",
    },
  });

  useEffect(() => {
    if (tasksData) {
      form.reset(tasksData);
    }

    fetchOwnersList();
  }, [fetchOwnersList, form, tasksData]);

  const onSubmit = async (values: z.infer<typeof tasksSchema>) => {
    const requestData: CreateTaskType = {
      category: values.category,
      description: values.comments ?? "",
      priority: values.priority,
      status: "PENDING",
      notes: values.task,
      dueDate: `${values.dueDate}`,
      assignedProviderId: selectedOwner?.providerDetails?.id ?? "",
      assignerProviderId: providerDetails.providerId,
      assignedByAdmin: true,
      userDetailsId: "97f41397-3fe3-4f0b-a242-d3370063db33",
    };

    setLoading(true);
    try {
      await createTask({ requestBody: requestData });

      showToast({
        toast,
        type: "success",
        message: "Task created successfully",
      });
    } catch (err) {
      if (err instanceof Error) {
        showToast({
          toast,
          type: "error",
          message: "Task creation failed",
        });
      }
    } finally {
      setLoading(false);
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
                  onCheckedChange={(checked) =>
                    setShowPatientSpecific(checked as boolean)
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
                      <FormItem>
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
                                  filteredPatients.map((patient, index) => (
                                    <div
                                      key={index}
                                      className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                      onClick={() => {
                                        setSearchTerm(patient);
                                        field.onChange(patient);
                                        setVisibleSearchList(false);
                                      }}
                                    >
                                      {patient}
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
              <Button type="submit" className="bg-[#84012A] hover:bg-[#6C011F]">
                Save
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TasksDialog;
