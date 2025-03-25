import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { recallFormSchema } from "@/schema/recallFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { RecallsEditData } from "@/types/recallsInterface";
import {
  createRecalls,
  updateRecallsData,
} from "@/services/chartDetailsServices";
import { showToast } from "@/utils/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";
import { FetchProviderList } from "@/types/providerDetailsInterface";
import { fetchProviderListDetails } from "@/services/registerServices";

const RecallsDialog = ({
  userDetailsId,
  recallsData,
  onClose,
  isOpen,
}: {
  userDetailsId: string;
  recallsData?: RecallsEditData | null;
  onClose: () => void;
  isOpen: boolean;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [ownersList, setOwnersList] = useState<FetchProviderList[]>([]);
  // const [selectedOwner, setSelectedOwner] = useState<FetchProviderList>();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof recallFormSchema>>({
    resolver: zodResolver(recallFormSchema),
    defaultValues: {
      type: recallsData?.type || "",
      notes: recallsData?.notes || "",
      dueDate: {
        period: recallsData?.due_date_period || "",
        value: recallsData?.due_date_value || 1,
        unit: recallsData?.due_date_unit || "",
      },
      provider: recallsData?.providerId || "",
      sendAutoReminders: recallsData?.auto_reminders || false,
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
    if (recallsData) {
      form.reset({
        type: recallsData.type || "",
        notes: recallsData.notes || "",
        dueDate: {
          period: recallsData.due_date_period || "",
          value: recallsData.due_date_value || 1,
          unit: recallsData.due_date_unit || "",
        },
        provider: recallsData.providerId || "", 
        sendAutoReminders: recallsData.auto_reminders || false,
      });
      const selected = ownersList.find(
        (owner) => owner.providerDetails?.id === recallsData.providerId
      );
      form.setValue("provider", selected?.providerDetails?.id ?? "")
    } else {
      form.reset({
        type: "",
        notes: "",
        dueDate: {
          period: "",
          value: 1,
          unit: "",
        },
        provider: "", 
        sendAutoReminders: false,
      });
    }
  }, [recallsData, form, ownersList]);

  const onSubmit = async (values: z.infer<typeof recallFormSchema>) => {
    console.log("Form Values:", values);
    setLoading(true);
    try {
      if (recallsData) {
        const requestData = {
          type: values.type,
          notes: values.notes,
          due_date_period: values.dueDate.period,
          due_date_value: values.dueDate.value,
          due_date_unit: values.dueDate.unit,
          auto_reminders: values.sendAutoReminders ?? false,
        };
        await updateRecallsData({
          requestData: requestData,
          id: recallsData.id,
        });
      } else {
        const requestData = {
          type: values.type,
          notes: values.notes,
          providerId: values.provider,
          due_date_period: values.dueDate.period,
          due_date_value: values.dueDate.value,
          due_date_unit: values.dueDate.unit,
          auto_reminders: values.sendAutoReminders ?? false,
          userDetailsId: userDetailsId,
        };
        await createRecalls({ requestData: requestData });
      }
      showToast({
        toast,
        type: "success",
        message: "Recalls added successfully",
      });
      onClose();
      form.reset();
    } catch (e) {
      console.error("Error:", e);
      showToast({
        toast,
        type: "error",
        message: "Error while adding Recalls",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {recallsData ? "Update Recall" : "Add Recall"}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ScrollArea className="max-h-[90dvh] h-auto">
              <div className="flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Asynchronous Refill Visit">
                              Asynchronous Refill Visit
                            </SelectItem>
                            <SelectItem value="Synchronous Visit">
                              Synchronous Visit
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-row gap-2">
                  <FormField
                    control={form.control}
                    name="dueDate.period"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Due Date</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="after">After</SelectItem>
                              <SelectItem value="before">Before</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dueDate.value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Value</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            className="w-full"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dueDate.unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Unit" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="days">Days</SelectItem>
                              <SelectItem value="weeks">Weeks</SelectItem>
                              <SelectItem value="months">Months</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* Provider */}
                <FormField
                  control={form.control}
                  name="provider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provider</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            // const selected = ownersList.find(
                            //   (owner) => owner.providerDetails?.id === value
                            // );
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
                                  value={owner?.providerDetails?.id ?? owner.id}
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

                {/* Auto Reminders */}
                <FormField
                  control={form.control}
                  name="sendAutoReminders"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          label="Send Auto Reminders to Patient"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem className="flex flex-1 w-full">
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add notes here..."
                          {...field}
                          className="resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </ScrollArea>
            <DialogFooter>
              <div className="flex w-full justify-end">
                <div className="flex  gap-2 w-fit">
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <SubmitButton
                    label={loading ? "Adding..." : "Add"}
                    disabled={loading}
                  />
                </div>
              </div>
            </DialogFooter>
          </form>
        </Form>
        {/* <DialogFooter> */}
        {/* <div className="flex w-full justify-end">
                  <div className="flex  gap-2 w-fit">
                    <Button variant="outline" onClick={onClose}>
                      Cancel
                    </Button>
                    <SubmitButton label="Add"></SubmitButton>
                  </div>
          </div> */}
        {/* </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
};

export default RecallsDialog;
