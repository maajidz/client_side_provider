import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectValue,
  SelectContent,
  SelectTrigger,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { addMedicationFormSchema } from "@/schema/addMedicationSchema";
import { MedicationList } from "./Medications";

interface MedicationDetailsDialogProps {
  isOpen: boolean;
  medication: MedicationList | null;
  onClose: () => void;
  form: UseFormReturn<z.infer<typeof addMedicationFormSchema>>; // Replace `any` with the form schema type if available
  onSubmit?: (values: z.infer<typeof addMedicationFormSchema>) => Promise<void>; // Optional submit handler for better flexibility
}

const MedicationDetailsDialog: React.FC<MedicationDetailsDialogProps> = ({
  isOpen,
  medication,
  onClose,
  form,
  onSubmit,
}) => {
  const handleSubmit = form.handleSubmit(onSubmit || (() => Promise.resolve()));

  return (
    <Dialog open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Medication</DialogTitle>
        </DialogHeader>
        {medication ? (
          <div className="mb-4">
            <p>
              <strong>Medication:</strong> {medication.productName}
            </p>
            <p>
              <strong>Details:</strong> {medication.strength},{" "}
              {medication.route}, {medication.doseForm}
            </p>
          </div>
        ) : (
          <p>No medication selected</p>
        )}
        <Form {...form}>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-5">
              <FormField
                control={form.control}
                name="directions"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel>Directions</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between gap-4">
                <FormField
                  control={form.control}
                  name="fromDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2">
                      <FormLabel>From Date</FormLabel>
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
                    <FormItem className="flex flex-col gap-2">
                      <FormLabel>To Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose status" />
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
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="bg-gray-100 text-gray-600"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#84012A] text-white">
                  Save
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MedicationDetailsDialog;

