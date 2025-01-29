"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
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
import SubmitButton from "@/components/custom_buttons/SubmitButton";
import { PatientDetails } from "@/types/userInterface";
import FormLabels from "@/components/custom_buttons/FormLabels";
import { Globe } from "lucide-react";
import { timeZonesList } from "@/constants/data";
import { CreateUserAppointmentsInterface } from "@/types/appointments";
import { createUserAppointments } from "@/services/providerAppointments";

export function AppointmentsDialog({
  userDetailsId,
  userData,
  onClose,
  isOpen,
}: {
  userDetailsId: string;
  userData: PatientDetails;
  onClose: () => void;
  isOpen: boolean;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [ownersList, setOwnersList] = useState<FetchProviderList[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { toast } = useToast();

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      additionalText: "",
      reason: "",
      dateOfAppointment: new Date(),
      timeOfAppointment: "",
      timeZone: "",
      status: "Scheduled",
      providerId: "",
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

  useEffect(() => {
    fetchOwnersList();
  }, [fetchOwnersList]);

  const filteredTimeZones = timeZonesList.filter((group) =>
    group.values.some((zone) =>
      zone.label.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

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
        const response = await createUserAppointments({
          requestData: requestData,
        });
        if (response) {
          showToast({toast, type: "success", message: "Appointment Created successfully"})
        }
      } catch (error) {
        console.log("Error", error)
        showToast({toast, type: "error", message: "Error creating Appointment"})
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
      <DialogContent className="w-auto">
        <DialogHeader>
          <DialogTitle>
            New Appointment for {userData?.user?.firstName?.toWellFormed()}{" "}
            {userData.user.lastName}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3 w-full">
          <div className="flex flex-col gap-2">
            <FormLabels label="Email" value={userData?.user?.email} />
            <FormLabels
              label="Phone Number"
              value={userData?.user?.phoneNumber}
            />
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 ">
              <FormField
                control={form.control}
                name="providerId"
                render={({ field }) => (
                  <FormItem className="flex gap-2 items-center">
                    <FormLabel>Provider</FormLabel>
                    <Select
                    defaultValue={field.value}
                    value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
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
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex gap-2  items-center">
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange}>
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
              <FormField
                control={form.control}
                name="dateOfAppointment"
                render={({ field }) => (
                  <FormItem className="flex gap-2 items-center">
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
                <FormField
                  control={form.control}
                  name="timeOfAppointment"
                  render={({ field }) => (
                    <FormItem className="flex gap-2 items-center">
                      <FormLabel className="w-28">Start Time</FormLabel>
                      <Input type="time" {...field} value={field.value} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="timeZone"
                  render={({ field }) => (
                    <FormItem className="flex gap-2 items-center">
                      <FormLabel className="w-20">Time zone</FormLabel>
                      <FormControl>
                        <div className="flex flex-row items-center">
                          <Globe color="#84012A" />
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                            }}
                            value={field.value}
                          >
                            <SelectTrigger className="border-none">
                              <SelectValue
                                placeholder="Select a timezone"
                                className="border-none"
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <Input
                                type="text"
                                placeholder="Search time zones"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-2 border rounded-md"
                              />
                              {filteredTimeZones.map((group, index) => (
                                <SelectGroup key={index}>
                                  <SelectLabel>{group.label}</SelectLabel>
                                  {group.values.map((tz) => (
                                    <SelectItem key={tz.value} value={tz.value}>
                                      {tz.label}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem className="flex gap-2  items-center">
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
                  <FormItem className="flex  items-center">
                    <FormLabel className="w-48">Message to Patient</FormLabel>
                    <Textarea {...field} value={field.value} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-3 justify-between w-full">
                <Button type="button" variant="secondary" onClick={onClose}>
                  Cancel
                </Button>
                <SubmitButton label="Create"  />
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
