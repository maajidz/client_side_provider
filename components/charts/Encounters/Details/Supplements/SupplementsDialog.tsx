import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";
import formStyles from "@/components/formStyles.module.css";
import LoadingButton from "@/components/LoadingButton";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { supplementsFormSchema } from "@/schema/supplementsSchema";
import {
  createSupplement,
  updateSupplement,
} from "@/services/chartDetailsServices";
import { SupplementInterface } from "@/types/supplementsInterface";
import { showToast } from "@/utils/utils";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

function SupplementsDialog({
  userDetailsId,
  onClose,
  isOpen,
  selectedSupplement,
}: {
  userDetailsId: string;
  onClose: () => void;
  isOpen: boolean;
  selectedSupplement?: SupplementInterface | null;
}) {
  // Loading State
  const [loading, setLoading] = useState<boolean>(false);

  // Toast State
  const { toast } = useToast();

  const form = useForm<z.infer<typeof supplementsFormSchema>>({
    resolver: zodResolver(supplementsFormSchema),
    defaultValues: {
      supplement: selectedSupplement?.supplement || "",
      manufacturer: selectedSupplement?.manufacturer || "",
      fromDate:
        selectedSupplement?.fromDate.split("T")[0] ||
        new Date().toISOString().split("T")[0],
      toDate:
        selectedSupplement?.toDate.split("T")[0] ||
        new Date().toISOString().split("T")[0],
      status: selectedSupplement?.status || "Active",
      dosage: selectedSupplement?.dosage || "",
      unit: selectedSupplement?.unit || "",
      frequency: selectedSupplement?.frequency || "",
      intake_type: selectedSupplement?.intake_type || "",
      comments: selectedSupplement?.comments || "",
    },
  });

  useEffect(() => {
    if (selectedSupplement) {
      form.reset({
        supplement: selectedSupplement?.supplement || "",
        manufacturer: selectedSupplement?.manufacturer || "",
        fromDate:
          selectedSupplement?.fromDate.split("T")[0] ||
          new Date().toISOString().split("T")[0],
        toDate:
          selectedSupplement?.toDate.split("T")[0] ||
          new Date().toISOString().split("T")[0],
        status: selectedSupplement?.status || "Active",
        dosage: selectedSupplement?.dosage || "",
        unit: selectedSupplement?.unit || "",
        frequency: selectedSupplement?.frequency || "",
        intake_type: selectedSupplement?.intake_type || "",
        comments: selectedSupplement?.comments || "",
      });
      if (selectedSupplement.manufacturer) {
        form.setValue("manufacturer", selectedSupplement?.manufacturer);
      }
    }
  }, [selectedSupplement, form]);

  // POST Supplement
  const onSubmit = async (values: z.infer<typeof supplementsFormSchema>) => {
    setLoading(true);
    try {
      const supplementData = {
        ...values,
        userDetailsId: userDetailsId,
      };

      if (!selectedSupplement) {
        await createSupplement(supplementData);

        showToast({
          toast,
          type: "success",
          message: "Supplement created successfully",
        });
      } else {
        await updateSupplement({
          requestData: supplementData,
          supplementId: selectedSupplement?.id,
        });

        showToast({
          toast,
          type: "success",
          message: "Supplement updated successfully",
        });
      }
    } catch (err) {
      console.log("Error", err);
      showToast({
        toast,
        type: "error",
        message: "Supplement creation failed",
      });
    } finally {
      setLoading(false);
      form.reset();
      onClose();
    }
  };

  if (loading) {
    return <LoadingButton />;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[465px]">
        <DialogHeader>
          <DialogTitle>
            {selectedSupplement ? "Edit Supplement" : "Add Supplement"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[30rem] max-h-[30rem] p-2.5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className={formStyles.formBody}>
                <FormField
                  control={form.control}
                  name="supplement"
                  render={({ field }) => (
                    <FormItem className={formStyles.formItem}>
                      <FormLabel>Supplement</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="manufacturer"
                  render={({ field }) => (
                    <FormItem className={formStyles.formItem}>
                      <FormLabel className="w-fit">Manufacturer</FormLabel>
                      <FormControl>
                        <Select
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choose Manufacturer" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="love_wellness">
                              Love Wellness
                            </SelectItem>
                            <SelectItem value="manufacturer2">
                              Manufacturer 2
                            </SelectItem>
                            <SelectItem value="manufacturer3">
                              Manufacturer 3
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-between gap-3">
                  <FormField
                    control={form.control}
                    name="fromDate"
                    render={({ field }) => (
                      <FormItem className={`${formStyles.formItem} w-full`}>
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
                    name="toDate"
                    render={({ field }) => (
                      <FormItem className={`${formStyles.formItem} w-full`}>
                        <FormLabel>To Date:</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className={formStyles.formItem}>
                      <FormLabel className="w-fit">Status</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choose Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dosage"
                  render={({ field }) => (
                    <FormItem className={formStyles.formItem}>
                      <FormLabel>Dosage</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem className={formStyles.formItem}>
                      <FormLabel className="w-fit">Unit</FormLabel>
                      <FormControl>
                        <Select
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Unit" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gram">gram</SelectItem>
                            <SelectItem value="mg">mg</SelectItem>
                            <SelectItem value="ml">ml</SelectItem>
                            <SelectItem value="tablet(s)">tablet(s)</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="frequency"
                  render={({ field }) => (
                    <FormItem className={formStyles.formItem}>
                      <FormLabel className="w-fit">Frequency</FormLabel>
                      <FormControl>
                        <Select
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="once_day">Once a day</SelectItem>
                            <SelectItem value="twice_day">
                              Twice a day
                            </SelectItem>
                            <SelectItem value="three_day">
                              Three times a day
                            </SelectItem>
                            <SelectItem value="week">Once a week</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="intake_type"
                  render={({ field }) => (
                    <FormItem className={formStyles.formItem}>
                      <FormLabel className="w-fit">Intake type</FormLabel>
                      <FormControl>
                        <Select
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choose Intake Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="away_from_meals">
                              Away From Meals
                            </SelectItem>
                            <SelectItem value="with_breakfast">
                              With Breakfast
                            </SelectItem>
                            <SelectItem value="with_dinner">
                              With Dinner
                            </SelectItem>
                            <SelectItem value="at_bedtime">
                              At Bedtime
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="comments"
                  render={({ field }) => (
                    <FormItem className={formStyles.formItem}>
                      <FormLabel>Comments</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <SubmitButton
                  label={selectedSupplement ? "Update " : "Save"}
                  disabled={loading}
                />
              </div>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default SupplementsDialog;
