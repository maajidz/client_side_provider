import React, { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createInjectionSchema } from "@/schema/createInjections";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CreateInjectionInterface,
  InjectionsData,
  UpdateInjectionInterface,
} from "@/types/injectionsInterface";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import LoadingButton from "@/components/LoadingButton";
import {
  createInjection,
  updateInjection,
} from "@/services/injectionsServices";
import { showToast } from "@/utils/utils";
import { useToast } from "@/hooks/use-toast";
import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";
import formStyles from "@/components/formStyles.module.css";
import { getDosageUnits } from "@/services/enumServices";

const InjectionsDialog = ({
  userDetailsId,
  injectionsData,
  onClose,
  isOpen,
}: {
  userDetailsId: string;
  injectionsData?: InjectionsData | null;
  onClose: () => void;
  isOpen: boolean;
}) => {
  const providerDetails = useSelector((state: RootState) => state.login);
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();

  // Dosage Units
  const [dosageUnits, setDosageUnits] = useState<string[]>([]);

  // GET Dosage Units
  const fetchDosageUnits = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getDosageUnits();

      if (response) {
        setDosageUnits(response);
      }
    } catch (err) {
      if (err instanceof Error) {
        showToast({
          toast,
          type: "error",
          message: "Could not fetch dosage units",
        });
      } else {
        showToast({
          toast,
          type: "error",
          message: "An unknown error occurred",
        });
      }
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const form = useForm<z.infer<typeof createInjectionSchema>>({
    resolver: zodResolver(createInjectionSchema),
    defaultValues: {
      injection_name: injectionsData?.injection_name || "",
      dosage_unit: injectionsData?.dosage_unit || "",
      dosage_quantity: injectionsData?.dosage_quantity || 0,
      frequency: injectionsData?.frequency || "",
      period_number: injectionsData?.period_number || 0,
      period_unit: injectionsData?.period_unit || "",
      parental_route: injectionsData?.parental_route || "",
      site: injectionsData?.site || "",
      lot_number: injectionsData?.lot_number || 0,
      expiration_date: injectionsData?.expiration_date || "",
      administered_date: injectionsData?.administered_date || "",
      administered_time: injectionsData?.administered_time || "",
      note_to_nurse: injectionsData?.note_to_nurse || "",
      comments: injectionsData?.comments || "",
    },
  });

  useEffect(() => {
    if (injectionsData) {
      form.reset({
        injection_name: injectionsData.injection_name || "",
        dosage_unit: injectionsData.dosage_unit || "",
        dosage_quantity: injectionsData.dosage_quantity || 0,
        frequency: injectionsData.frequency || "",
        period_number: injectionsData.period_number || 0,
        period_unit: injectionsData.period_unit || "",
        parental_route: injectionsData.parental_route || "",
        site: injectionsData.site || "",
        lot_number: injectionsData.lot_number || 0,
        expiration_date: injectionsData.expiration_date || "",
        administered_date: injectionsData.administered_date || "",
        administered_time: injectionsData.administered_time || "",
        note_to_nurse: injectionsData.note_to_nurse || "",
        comments: injectionsData.comments || "",
      });
    }
  }, [form, injectionsData]);

  const onSubmit = async (values: z.infer<typeof createInjectionSchema>) => {
    console.log(values);
    try {
      setLoading(true);
      if (injectionsData) {
        const requestBody: UpdateInjectionInterface = {
          ...values,
          status: "pending",
        };
        const response = await updateInjection({
          requestBody: requestBody,
          id: injectionsData.id,
        });
        if (response) {
          showToast({
            toast,
            type: "success",
            message: "Injection updated successfully",
          });
        }
      } else {
        const requestBody: CreateInjectionInterface = {
          ...values,
          status: "pending",
          userDetailsId,
          providerId: providerDetails.providerId,
        };
        const response = await createInjection({ requestBody: requestBody });
        if (response) {
          showToast({
            toast,
            type: "success",
            message: "Injection added successfully",
          });
        }
      }
    } catch (error) {
      console.log(error);
      showToast({
        toast,
        type: "error",
        message: " Error while adding Injection",
      });
    } finally {
      setLoading(false);
      form.reset();
      onClose();
    }
  };

  useEffect(() => {
    fetchDosageUnits();
  }, [fetchDosageUnits]);

  if (loading) {
    return <LoadingButton />;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {injectionsData ? "Edit Injections" : "Add Injections"}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[80dvh]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6 p-2.5">
                <FormField
                  control={form.control}
                  name="injection_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter injection to add"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div>
                  <div className="flex gap-3 items-end">
                    <FormField
                      control={form.control}
                      name="dosage_quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dosage</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(e.target.valueAsNumber)
                              }
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dosage_unit"
                      render={({ field }) => (
                        <FormItem className={`${formStyles.formItem} w-full`}>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Unit" />
                              </SelectTrigger>
                              <SelectContent>
                                {dosageUnits.map((unit) => (
                                  <SelectItem key={unit} value={unit}>
                                    {unit}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequency</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="frequency1">
                              Frequency 1
                            </SelectItem>
                            <SelectItem value="frequency2">
                              Frequency 2
                            </SelectItem>
                            <SelectItem value="frequency3">
                              Frequency 3
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <div>
                  <div className="flex gap-3 items-end">
                    <FormField
                      control={form.control}
                      name="period_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Period</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(e.target.valueAsNumber)
                              }
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="period_unit"
                      render={({ field }) => (
                        <FormItem className={`${formStyles.formItem} w-full`}>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Unit" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Days">Day(s)</SelectItem>
                                <SelectItem value="Weeks">Week(s)</SelectItem>
                                <SelectItem value="months">Month(s)</SelectItem>
                                <SelectItem value="years">Year(s)</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="parental_route"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parenteral Route</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Parenteral Route" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="parenteralRoute1">
                              Parenteral Route 1
                            </SelectItem>
                            <SelectItem value="parenteralRoute2">
                              Parenteral Route 2
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="site"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Site" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="site1">Site 1</SelectItem>
                            <SelectItem value="site2">Site 2</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lot_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lot number</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expiration_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiration Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} className="w-fit" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-3">
                  <FormField
                    control={form.control}
                    name="administered_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Administered Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="administered_time"
                    render={({ field }) => (
                      <FormItem className={`${formStyles.formItem} w-full`}>
                        <FormLabel>Administered Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="note_to_nurse"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Note to nurse</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                <SubmitButton label="Submit" />
              </div>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default InjectionsDialog;
