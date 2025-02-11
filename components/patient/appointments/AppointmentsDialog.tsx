"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AppointmentFormValues,
  appointmentSchema,
} from "@/schema/appointmentSchema";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import { useCallback, useEffect, useState } from "react";
import { FetchProviderList } from "@/types/providerDetailsInterface";
import { fetchProviderListDetails } from "@/services/registerServices";
import { showToast } from "@/utils/utils";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import LoadingButton from "@/components/LoadingButton";
import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";
import { UserAppointmentInterface } from "@/types/userInterface";
import FormLabels from "@/components/custom_buttons/FormLabels";
import { CreateUserAppointmentsInterface } from "@/types/appointments";
import { createUserAppointments } from "@/services/providerAppointments";
import formStyles from "@/components/formStyles.module.css";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { fetchProviderAvaialability } from "@/services/availabilityServices";
import { ProviderAvailability } from "@/types/calendarInterface";

export function AppointmentsDialog({
  userDetailsId,
  appointmentsData,
  onClose,
  isOpen,
}: {
  userDetailsId: string;
  appointmentsData?: UserAppointmentInterface | null;
  onClose: () => void;
  isOpen: boolean;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [ownersList, setOwnersList] = useState<FetchProviderList[]>([]);
  const [providerAvailability, setProviderAvailability] =
    useState<ProviderAvailability | null>(null);
  const [selectedOwner, setSelectedOwner] = useState<FetchProviderList>();
  const userData = useSelector((state: RootState) => state.user);

  const { toast } = useToast();

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      additionalText: appointmentsData?.additionalText || "",
      reason: appointmentsData?.reason || "",
      dateOfAppointment: appointmentsData?.dateOfAppointment
        ? new Date(appointmentsData.dateOfAppointment)
        : new Date(),
      timeOfAppointment: appointmentsData?.timeOfAppointment || "",
      status:
        (appointmentsData?.status as
          | "Scheduled"
          | "Consulted"
          | "No Show"
          | "Confirmed") || "Scheduled",
      providerId: selectedOwner?.providerDetails?.id || "",
    },
  });

  useEffect(() => {
    if (appointmentsData) {
      form.reset({
        additionalText: appointmentsData?.additionalText,
        reason: appointmentsData?.reason,
        dateOfAppointment: new Date(appointmentsData.dateOfAppointment),
        timeOfAppointment: appointmentsData?.timeOfAppointment,
        status: appointmentsData?.status as
          | "Scheduled"
          | "Consulted"
          | "No Show"
          | "Confirmed",
        providerId: appointmentsData?.providerId,
      });
      if (appointmentsData.providerId && ownersList) {
        const selected = ownersList.find(
          (owner) => owner.providerDetails?.id === appointmentsData.providerId
        );
        setSelectedOwner(selected);
        form.setValue("providerId", appointmentsData.providerId);
      }
    }
  }, [appointmentsData, form, selectedOwner, ownersList]);

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

  const fetchAvailability = useCallback(async () => {
    if (selectedOwner?.providerDetails?.id) {
      setLoading(true);
      try {
        const fetchedAvailabilties = await fetchProviderAvaialability({
          providerID: selectedOwner?.providerDetails?.id,
          startDate:
            form.getValues().dateOfAppointment.toISOString().split("T")[0] ??
            "",
          endDate:
            form.getValues().dateOfAppointment.toISOString().split("T")[0] ??
            "",
        });

        console.log("Fetched Availabilties:", fetchedAvailabilties);

        if (fetchedAvailabilties) {
          setProviderAvailability(fetchedAvailabilties);
        }
      } catch (error) {
        console.error("Error fetching availability:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [selectedOwner?.providerDetails?.id, form.getValues().dateOfAppointment, form]);

  useEffect(() => {
    fetchOwnersList();
    fetchAvailability();
  }, [fetchOwnersList, fetchAvailability]);

  const filteredDate = providerAvailability?.data.find(
    (availability) =>
      availability.date ===
      form.getValues().dateOfAppointment.toISOString().split("T")[0]
  );

  const onSubmit = async (values: AppointmentFormValues) => {
    if (userData) {
      const requestData: CreateUserAppointmentsInterface = {
        patientName: `${userData?.firstName} ${userData?.lastName}`,
        // patientEmail: `${userData?.email}`,
        patientEmail: "ahbazarkoob@gmail.com",
        patientPhoneNumber: `${userData?.phoneNumber}`,
        additionalText: values.additionalText,
        dateOfAppointment: values.dateOfAppointment.toISOString().split("T")[0],
        timeOfAppointment: values.timeOfAppointment,
        timeZone: "UTC",
        status: values.status,
        providerId: values.providerId,
        userDetailsId: userDetailsId,
        reason: values.reason,
        additionalGuestInfo: [
          {
            name: "",
            phoneNumber: "",
            email: "",
          },
        ],
      };
      console.log(requestData);
      try {
        setLoading(true);
        if (appointmentsData) {
        } else {
          const response = await createUserAppointments({
            requestData: requestData,
          });
          if (response) {
            showToast({
              toast,
              type: "success",
              message: "Appointment Created successfully",
            });
          }
        }
      } catch (error) {
        console.log("Error", error);
        showToast({
          toast,
          type: "error",
          message: "Error creating Appointment",
        });
      } finally {
        setLoading(false);
        form.reset();
        onClose();
      }
    }
  };

  if (loading) {
    return <LoadingButton />;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className=" w-[50rem]">
        <DialogHeader>
          <DialogTitle className="capitalize">
            {appointmentsData
              ? `Edit Appointment for ${appointmentsData.patientName}`
              : `New Appointment for ${userData?.firstName}
            ${userData?.lastName}`}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[30rem] h-auto w-auto">
          <div className={formStyles.formBody}>
            <div className="flex flex-col gap-2 px-3">
              <FormLabels
                label="Email"
                value={
                  appointmentsData
                    ? appointmentsData.patientEmail
                    : userData?.email
                }
              />
              <FormLabels
                label="Phone Number"
                value={
                  appointmentsData
                    ? appointmentsData.patientPhoneNumber
                    : userData?.phoneNumber
                }
              />
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className={formStyles.formBody}>
                  {appointmentsData ? (
                    <FormLabels
                      label="Provider:"
                      value={appointmentsData.providerName}
                    />
                  ) : (
                    <FormField
                      control={form.control}
                      name="providerId"
                      render={({ field }) => (
                        <FormItem className={formStyles.formItem}>
                          <FormLabel>Provider</FormLabel>
                          <Select
                            defaultValue={field.value}
                            onValueChange={(value) => {
                              field.onChange(value);
                              const selected = ownersList.find(
                                (owner) => owner.providerDetails?.id === value
                              );
                              setSelectedOwner(selected);
                              console.log(selected);
                              console.log("Selected Provider ID:", value);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a provider" />
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className={formStyles.formItem}>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={"Scheduled"}>
                              Scheduled
                            </SelectItem>
                            <SelectItem value={"Consulted"}>
                              Consulted
                            </SelectItem>
                            <SelectItem value={"No Show"}>No Show</SelectItem>
                            <SelectItem value={"Confirmed"}>
                              Confirmed
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-row gap-4">
                    {appointmentsData ? (
                      <FormLabels
                        label="Date"
                        value={appointmentsData.dateOfAppointment}
                      />
                    ) : (
                      <FormField
                        control={form.control}
                        name="dateOfAppointment"
                        render={({ field }) => (
                          <FormItem className={formStyles.formItem}>
                            <FormLabel>Date</FormLabel>
                            <Input
                              type="date"
                              {...field}
                              value={
                                field.value instanceof Date
                                  ? field.value.toISOString().split("T")[0]
                                  : ""
                              }
                              onChange={(e) =>
                                field.onChange(new Date(e.target.value))
                              }
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    {appointmentsData ? (
                      <FormLabels
                        label="Start Time"
                        value={`${appointmentsData.timeOfAppointment} / ${appointmentsData.timeZone}`}
                      />
                    ) : (
                      <FormField
                        control={form.control}
                        name="timeOfAppointment"
                        render={({ field }) => (
                          <FormItem className={formStyles.formItem}>
                            <FormLabel className="w-28">Time Slot</FormLabel>
                            {/* <Input
                                type="time"
                                {...field}
                                value={field.value}
                              /> */}
                            <Select
                              defaultValue={field.value}
                              onValueChange={(value) => {
                                field.onChange(value);
                                const selectedSlot = filteredDate?.slots.find(
                                  (availability) =>
                                    availability.startTime === value
                                );
                                console.log(selectedSlot);
                                console.log("Selected Slot Start Time:", value);
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a time slot" />
                              </SelectTrigger>
                              <SelectContent>
                                {filteredDate?.slots.map((availability) => (
                                  <SelectItem
                                    key={availability.id}
                                    value={availability.startTime}
                                  >
                                    {availability.startTime}{""}-(30 min)
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                  <FormField
                    control={form.control}
                    name="reason"
                    render={({ field }) => (
                      <FormItem className={formStyles.formItem}>
                        <FormLabel>Reason</FormLabel>
                        <Textarea {...field} value={field.value} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="additionalText"
                    render={({ field }) => (
                      <FormItem className={formStyles.formItem}>
                        <FormLabel>Message to Patient</FormLabel>
                        <Textarea {...field} value={field.value} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
                    label={appointmentsData ? "Update" : "Create"}
                  />
                </div>
              </form>
            </Form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
