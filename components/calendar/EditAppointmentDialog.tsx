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
  DialogDescription,
} from "@/components/ui/dialog";
import { useCallback, useEffect, useState } from "react";
import { showToast } from "@/utils/utils";
import { Textarea } from "@/components/ui/textarea";
import LoadingButton from "@/components/LoadingButton";
import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";
import FormLabels from "@/components/custom_buttons/FormLabels";
import {
  CreateUserAppointmentsInterface,
  ProviderAppointmentsData,
} from "@/types/appointments";
import { updateAppointment } from "@/services/providerAppointments";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { fetchProviderAvaialability } from "@/services/availabilityServices";
import { ProviderAvailability } from "@/types/calendarInterface";
import { useToast } from "@/hooks/use-toast";

export function EditAppointmentDialog({
  userDetailsId,
  appointmentsData,
  onClose,
  isOpen,
}: {
  userDetailsId: string;
  appointmentsData?: Partial<ProviderAppointmentsData> | null;
  onClose: () => void;
  isOpen: boolean;
}) {
  const providerDetails = useSelector((state: RootState) => state.login);
  const [loading, setLoading] = useState<boolean>(false);
  const [providerAvailability, setProviderAvailability] =
    useState<ProviderAvailability | null>(null);
  const userData = useSelector((state: RootState) => state.user);
  const providerData = useSelector((state: RootState) => state.login);

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
    },
  });

  const selectedDate =
    form.watch("dateOfAppointment")?.toLocaleDateString("en-CA") ?? "";

  useEffect(() => {
    if (appointmentsData) {
      form.reset({
        additionalText: appointmentsData?.additionalText,
        reason: appointmentsData?.reason,
        dateOfAppointment: appointmentsData.dateOfAppointment
          ? new Date(appointmentsData.dateOfAppointment)
          : new Date(),
        timeOfAppointment: appointmentsData?.timeOfAppointment,
        status: appointmentsData?.status as
          | "Scheduled"
          | "Consulted"
          | "No Show"
          | "Confirmed",
      });
    }
  }, [appointmentsData, form]);

  const fetchAvailability = useCallback(async () => {
    if (!providerData?.providerId) {
      showToast({
        toast,
        type: "error",
        message: "Provider Details not found!",
      });
    }

    if (providerData?.providerId) {
      setLoading(true);
      try {
        const fetchedAvailabilties = await fetchProviderAvaialability({
          providerID: providerData?.providerId,
          startDate: selectedDate,
          endDate: selectedDate,
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
  }, [providerData?.providerId, selectedDate, toast]);

  useEffect(() => {
    if (selectedDate) fetchAvailability();
  }, [selectedDate, fetchAvailability]);

  const filteredDate = providerAvailability?.data.find(
    (availability) =>
      availability.date ===
      form.getValues().dateOfAppointment.toISOString().split("T")[0]
  );

  const onSubmit = async (values: AppointmentFormValues) => {
    if (userData) {
      const requestData: CreateUserAppointmentsInterface = {
        patientName: `${userData?.firstName} ${userData?.lastName}`,
        patientEmail: appointmentsData?.patientEmail ?? "",
        patientPhoneNumber: `${userData?.phoneNumber}`,
        additionalText: values.additionalText,
        dateOfAppointment: values.dateOfAppointment.toISOString().split("T")[0],
        timeOfAppointment: values.timeOfAppointment,
        timeZone: "UTC",
        status: values.status,
        providerId: providerData?.providerId,
        userDetailsId: userDetailsId,
        reason: values.reason,
        // additionalGuestInfo: [
        //   {
        //     name: "",
        //     phoneNumber: "",
        //     email: "",
        //   },
        // ],
      };
      try {
        setLoading(true);

        if (appointmentsData?.id) {
          await updateAppointment({
            requestData: requestData,
            appointmentID: appointmentsData?.id,
          });
        }
        showToast({
          toast,
          type: "success",
          message: "Appointment updated successfully",
        });
      } catch (error) {
        console.log("Error", error);
        showToast({
          toast,
          type: "error",
          message: "Error updating Appointment",
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
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(100dvh-6rem)] h-fit w-auto">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 p-4 bg-[#F3EFF0] rounded-lg **:text-xs ">
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
              <FormLabels
                label="Provider Name"
                value={`${providerDetails.firstName} ${providerDetails.lastName}`}
              />
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-6"
              >
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={"Scheduled"}>Scheduled</SelectItem>
                          <SelectItem value={"Consulted"}>Consulted</SelectItem>
                          <SelectItem value={"No Show"}>No Show</SelectItem>
                          <SelectItem value={"Confirmed"}>Confirmed</SelectItem>
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
                        <FormItem>
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
                        <FormItem>
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
                              {filteredDate?.slots ? (
                                filteredDate?.slots.map((availability) => (
                                  <SelectItem
                                    key={availability.id}
                                    value={availability.startTime}
                                  >
                                    {availability.startTime}
                                    {""}-(30 min) -{"Is Avaialable"}
                                    {availability.isAvailable ? "Yes" : "No"}
                                  </SelectItem>
                                ))
                              ) : (
                                <div className="text-xs text-gray-500 font-medium px-2 py-1">
                                  No slots available for {selectedDate}. Select
                                  a different date.
                                </div>
                              )}
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
                    <FormItem>
                      <FormLabel>Reason</FormLabel>
                      <Textarea {...field} onChange={field.onChange} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="additionalText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message to Patient</FormLabel>
                      <Textarea {...field} onChange={field.onChange} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                    disabled={loading}
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

