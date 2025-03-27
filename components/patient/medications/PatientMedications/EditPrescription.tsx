import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";
import { Button } from "@/components/ui/button";
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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { editPrescriptionSchema } from "@/schema/prescriptionSchema";
import { updateUserPrescription } from "@/services/prescriptionsServices";
import { PrescriptionDataInterface } from "@/types/prescriptionInterface";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { showToast } from "@/utils/utils";

interface EditPrescriptionProps {
  userDetailsId: string;
  isOpen: boolean;
  selectedPrescription: PrescriptionDataInterface | undefined;
  onFetchPrescriptionsList: (userDetailsId: string) => Promise<void>;
  onSetIsOpen: (value: boolean) => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
};

function EditPrescription({
  userDetailsId,
  isOpen,
  selectedPrescription,
  onFetchPrescriptionsList,
  onSetIsOpen,
}: EditPrescriptionProps) {
  // Loading State
  const [loading, setLoading] = useState(false);

  // Dialog State
  const { toast } = useToast();

  // Form state
  const form = useForm<z.infer<typeof editPrescriptionSchema>>({
    resolver: zodResolver(editPrescriptionSchema),
    defaultValues: {
      dispense_as_written: selectedPrescription?.dispense_as_written,
      internal_comments: selectedPrescription?.internal_comments,
      status: selectedPrescription?.status,
      fromDate: selectedPrescription?.fromDate
        ? formatDate(selectedPrescription?.fromDate)
        : new Date().toISOString().split("T")[0],
      toDate: selectedPrescription?.toDate
        ? formatDate(selectedPrescription?.toDate)
        : new Date().toISOString().split("T")[0],
    },
  });

  // Handle dialog state
  const handleIsOpen = (status: boolean) => {
    onSetIsOpen(status);
  };

  // UPDATE Prescription Data
  const onSubmit = async () => {
    setLoading(true);

    const formValues = form.getValues();

    try {
      await updateUserPrescription({
        id: selectedPrescription?.id ?? "",
        requestData: formValues,
      });

      showToast({
        toast,
        type: "success",
        message: "Prescription data updated successfully",
      });
    } catch (err) {
      if (err instanceof Error) {
        showToast({
          toast,
          type: "error",
          message: "Prescription data update failed",
        });
      } else {
        showToast({
          toast,
          type: "error",
          message: "Prescription data update failed. An unknown error occurred",
        });
      }
    } finally {
      setLoading(false);
      onSetIsOpen(false);
      await onFetchPrescriptionsList(userDetailsId);
      form.reset();
    }
  };

  useEffect(() => {
    if (selectedPrescription) {
      form.reset({
        dispense_as_written: selectedPrescription.dispense_as_written,
        fromDate: selectedPrescription?.fromDate
          ? formatDate(selectedPrescription?.fromDate)
          : new Date().toISOString().split("T")[0],
        toDate: selectedPrescription?.toDate
          ? formatDate(selectedPrescription?.toDate)
          : new Date().toISOString().split("T")[0],
        status:
          (selectedPrescription?.status as "pending" | "completed") ?? "active",
        internal_comments: selectedPrescription?.internal_comments ?? "",
      });
    }
  }, [selectedPrescription, form]);

  return (
    <Dialog open={isOpen} onOpenChange={handleIsOpen}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle asChild>Edit Prescription</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-4 text-sm">
              <div className="flex items-center gap-3">
                <span className="font-medium">Drug:</span>
                <span className="font-semibold">
                  {selectedPrescription?.prescription_drug_type.drug_name}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium">Directions:</span>
                <span className="font-semibold">
                  {selectedPrescription?.directions}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="font-medium">Dosage Quantity:</span>
                  {selectedPrescription?.dosages.map((dosage) => (
                    <span key={dosage.id} className="font-semibold">
                      {dosage.dosage_quantity} {dosage.dosage_unit}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium">Days of Supply:</span>
                <span className="font-semibold">
                  {selectedPrescription?.days_of_supply ?? ""}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium">Refills:</span>
                <span className="font-semibold">
                  {selectedPrescription?.additional_refills ?? ""}
                </span>
              </div>
              <div className="flex justify-between">
                <FormField
                  control={form.control}
                  name="dispense_as_written"
                  render={({ field }) => (
                    <FormItem className="flex gap-3">
                      <FormLabel className="font-medium">
                        Dispense As Written
                      </FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium">Note to Pharmacy:</span>
                <span className="font-semibold">
                  {selectedPrescription?.Note_to_Pharmacy ?? ""}
                </span>
              </div>
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="fromDate"
                  render={({ field }) => (
                    <FormItem className="flex gap-2">
                      <FormLabel className="font-medium">From Date</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" className="w-fit" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="toDate"
                  render={({ field }) => (
                    <FormItem className="flex gap-2">
                      <FormLabel className="font-medium">To Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          value={field.value}
                          onChange={field.onChange}
                          className="w-fit"
                        />
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
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel className="font-medium">Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        {/* <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem> */}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="internal_comments"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel className="font-medium">
                      Internal Comments
                    </FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => handleIsOpen(false)}>
                    Cancel
                  </Button>
                  <SubmitButton label="Save" disabled={loading} />
                </div>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditPrescription;
