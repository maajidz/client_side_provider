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
import {
  PatientDetails,
  UserAppointmentInterface,
} from "@/types/userInterface";
import FormLabels from "@/components/custom_buttons/FormLabels";
import { timeZonesList } from "@/constants/data";
import { CreateUserAppointmentsInterface } from "@/types/appointments";
import { createUserAppointments } from "@/services/providerAppointments";
import { fetchUserInfo } from "@/services/userServices";
import formStyles from "@/components/formStyles.module.css";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [userData, setUserData] = useState<PatientDetails>();
  const [selectedOwner, setSelectedOwner] = useState<FetchProviderList>();

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
      timeZone: appointmentsData?.timeZone || "",
      status:
        (appointmentsData?.status as
          | "Scheduled"
          | "Consulted"
          | "No Show"
          | "Confirmed") || "Scheduled",
      providerId: selectedOwner?.providerDetails?.id || "",
    },
  });

  const filteredTimeZones = timeZonesList.filter((zone) =>
    zone.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (appointmentsData) {
      form.reset({
        additionalText: appointmentsData?.additionalText,
        reason: appointmentsData?.reason,
        dateOfAppointment: new Date(appointmentsData.dateOfAppointment),
        timeOfAppointment: appointmentsData?.timeOfAppointment,
        timeZone: appointmentsData?.timeZone,
        status: appointmentsData?.status as
          | "Scheduled"
          | "Consulted"
          | "No Show"
          | "Confirmed",
        providerId: appointmentsData?.providerId,
      });
      if (appointmentsData.providerId && ownersList) {
        const selected = ownersList.find(
          (owner) => owner.id === appointmentsData.providerId
        );
        setSelectedOwner(selected);
        form.setValue("providerId", appointmentsData.providerId);
      }
    }
  }, [appointmentsData, form, selectedOwner, ownersList]);

  const fetchAndSetResponse = useCallback(async () => {
    setLoading(true);
    const userData = await fetchUserInfo({ userDetailsId: userDetailsId });
    if (userData) {
      setUserData(userData.userDetails);
      setLoading(false);
    }
  }, [userDetailsId]);

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
    fetchAndSetResponse();
    fetchOwnersList();
  }, [fetchOwnersList, fetchAndSetResponse]);

  const onSubmit = async (values: AppointmentFormValues) => {
    if (userData) {
      const requestData: CreateUserAppointmentsInterface = {
        patientName: `${userData?.user?.firstName} ${userData?.user?.lastName}`,
        patientEmail: `${userData?.user?.email}`,
        patientPhoneNumber: `${userData.user.phoneNumber}`,
        additionalText: values.additionalText,
        dateOfAppointment: values.dateOfAppointment.toISOString(),
        timeOfAppointment: values.timeOfAppointment,
        timeZone: values.timeZone,
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
      <DialogContent className="w-[30rem]">
        <DialogHeader>
          <DialogTitle>
            {appointmentsData
              ? `Edit Appointment for ${appointmentsData.patientName}`
              : `New Appointment for ${userData?.user?.firstName}
            ${userData?.user.lastName}`}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[30rem] h-auto">
          <div className={formStyles.formBody}>
            <div className="flex flex-col gap-2 px-3">
              <FormLabels
                label="Email"
                value={
                  appointmentsData
                    ? appointmentsData.patientEmail
                    : userData?.user?.email
                }
              />
              <FormLabels
                label="Phone Number"
                value={
                  appointmentsData
                    ? appointmentsData.patientPhoneNumber
                    : userData?.user?.phoneNumber
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
                                (owner) => owner.id === value
                              );
                              setSelectedOwner(selected);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a provider" />
                            </SelectTrigger>
                            <SelectContent>
                              {ownersList.map((owner) => (
                                <SelectItem key={owner.id} value={owner.id}>
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
                            value={field.value.toISOString().split("T")[0]}
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
                          <FormLabel className="w-28">Start Time</FormLabel>
                          <Input type="time" {...field} value={field.value} />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  {!appointmentsData && (
                    <FormField
                      control={form.control}
                      name="timeZone"
                      render={({ field }) => (
                        <FormItem className={formStyles.formItem}>
                          <FormLabel className="w-20">Time zone</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="border-none">
                              <SelectValue placeholder="Select a timezone" />
                            </SelectTrigger>
                            <SelectContent>
                              <Input
                                type="text"
                                placeholder="Search time zones"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-2 border rounded-md"
                              />
                              {filteredTimeZones.map((tz) => (
                                <SelectItem key={tz.value} value={tz.value}>
                                  {tz.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  )}
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
                        <FormLabel className="w-48">
                          Message to Patient
                        </FormLabel>
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
