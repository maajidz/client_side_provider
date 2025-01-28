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
import RadioButton from "@/components/custom_buttons/radio_button/RadioButton";
import { useCallback, useEffect, useState } from "react";
import { FetchProviderList } from "@/types/providerDetailsInterface";
import { fetchProviderListDetails } from "@/services/registerServices";
import { showToast } from "@/utils/utils";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import LoadingButton from "@/components/LoadingButton";
import SubmitButton from "@/components/custom_buttons/SubmitButton";

export function AppointmentsDialog({
  userDetailsId,
  onClose,
  isOpen,
}: {
  userDetailsId: string;
  onClose: () => void;
  isOpen: boolean;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [ownersList, setOwnersList] = useState<FetchProviderList[]>([]);
  const [selectedOwner, setSelectedOwner] = useState<FetchProviderList>();
  const { toast } = useToast();

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      category: "Appointment",
      patient: userDetailsId,
      provider: `${selectedOwner?.firstName} ${selectedOwner?.lastName}`,
      status: "Scheduled",
      visitType: "",
      appointmentMode: "In Person",
      appointmentFor: "Single Date",
      date: new Date(),
      startTime: "",
      duration: 10,
      reason: "",
      messageToPatient: "",
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

  const onSubmit = (values: AppointmentFormValues) => {
    console.log("Form Values:", values);
  };

  if (loading) {
    return <LoadingButton />;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <ScrollArea className="h-[70%]">
          <DialogHeader>
            <DialogTitle>New Appointment</DialogTitle>
          </DialogHeader>
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="flex gap-2">
                      <FormLabel>Category</FormLabel>
                      <div className="flex gap-4 w-full">
                        <RadioButton
                          label="Appointment"
                          name="category"
                          value="Appointment"
                          selectedValue={field.value.toString()}
                          onChange={() => field.onChange("Appointment")}
                        />
                        <RadioButton
                          label="Period"
                          name="category"
                          value="Waiting List"
                          selectedValue={field.value.toString()}
                          onChange={() => field.onChange("Waiting List")}
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="provider"
                  render={({ field }) => (
                    <FormItem className="flex gap-2">
                      <FormLabel>Provider</FormLabel>
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
                    <FormItem className="flex gap-2">
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a provider" />
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
                  name="visitType"
                  render={({ field }) => (
                    <FormItem className="flex gap-2">
                      <FormLabel>Visit Type</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select " />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={"Weight Loss"}>
                            Weight Loss
                          </SelectItem>
                          <SelectItem value={"Follow Up Visit"}>
                            Follow Up Visit
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="appointmentMode"
                  render={({ field }) => (
                    <FormItem className="flex gap-2">
                      <FormLabel>Category</FormLabel>
                      <div className="flex gap-4 w-full">
                        <RadioButton
                          label="In Person"
                          name="appointmentMode"
                          value="In Person"
                          selectedValue={field.value.toString()}
                          onChange={() => field.onChange("In Person")}
                        />
                        <RadioButton
                          label="Phone Call"
                          name="appointmentMode"
                          value="Phone Call"
                          selectedValue={field.value.toString()}
                          onChange={() => field.onChange("Phone Call")}
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="appointmentFor"
                  render={({ field }) => (
                    <FormItem className="flex gap-2 items-center">
                      <FormLabel>Appointment for</FormLabel>
                      <div className="flex gap-4 w-full">
                        <RadioButton
                          label="Single Date"
                          name="appointmentFor"
                          value="Single Date"
                          selectedValue={field.value.toString()}
                          onChange={() => field.onChange("Single Date")}
                        />
                        <RadioButton
                          label="Period"
                          name="appointmentFor"
                          value="period"
                          selectedValue={field.value.toString()}
                          onChange={() => field.onChange("period")}
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex gap-2">
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
                  name="startTime"
                  render={({ field }) => (
                    <FormItem className="flex gap-2">
                      <FormLabel>StartTime</FormLabel>
                      <Input type="time" {...field} value={field.value} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem className="flex gap-2">
                      <FormLabel>Reason</FormLabel>
                      <Textarea {...field} value={field.value} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="messageToPatient"
                  render={({ field }) => (
                    <FormItem className="flex gap-2">
                      <FormLabel>Message to Patient</FormLabel>
                      <Textarea {...field} value={field.value} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2.5">
                  <Button type="button" variant="secondary">
                    Cancel
                  </Button>
                  <SubmitButton label="Create" />
                </div>
              </form>
            </Form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
