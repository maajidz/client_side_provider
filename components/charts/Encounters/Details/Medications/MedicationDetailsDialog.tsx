import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { addMedicationFormSchema } from "@/schema/addMedicationSchema";
import { createMedicationPrescription } from "@/services/chartDetailsServices";
import { UserEncounterData } from "@/types/chartsInterface";
import {
  CreateMedicationPrescriptionInterface,
  MedicationResultInterface,
} from "@/types/medicationInterface";
import { showToast } from "@/utils/utils";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface MedicationDetailsDialogProps {
  isOpen: boolean;
  patientDetails: UserEncounterData;
  selectedMedication: MedicationResultInterface | undefined;
  onClose: () => void;
}

const MedicationDetailsDialog = ({
  isOpen,
  patientDetails,
  selectedMedication,
  onClose,
}: MedicationDetailsDialogProps) => {
  // Loading State
  const [loading, setLoading] = useState<boolean>(false);

  // Toast State
  const { toast } = useToast();

  const form = useForm<z.infer<typeof addMedicationFormSchema>>({
    resolver: zodResolver(addMedicationFormSchema),
    defaultValues: {
      directions: "",
      fromDate: new Date().toISOString().split("T")[0],
      toDate: new Date().toISOString().split("T")[0],
      status: "Active",
    },
  });

  const onSubmit = async (values: z.infer<typeof addMedicationFormSchema>) => {
    console.log("Form Values:", values);
    setLoading(true);
    try {
      if (
        patientDetails?.userDetails.id &&
        patientDetails.providerID &&
        selectedMedication?.id
      ) {
        const medicationData: CreateMedicationPrescriptionInterface = {
          ...values,
          medicationNameId: selectedMedication?.id,
          providerId: patientDetails?.providerID,
          userDetailsId: patientDetails?.userDetails?.id,
        };

        await createMedicationPrescription(medicationData);

        showToast({
          toast,
          type: "success",
          message: "Pharmacy added successfully",
        });
      } else {
        throw new Error("Some fields are missing");
      }
    } catch (err) {
      if (err instanceof Error) {
        showToast({
          toast,
          type: "error",
          message: "Could not add selected pharmacy",
        });
      }
    } finally {
      form.reset();
      setLoading(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Medication</DialogTitle>
        </DialogHeader>
        {loading ? (
          <LoadingButton />
        ) : selectedMedication ? (
          <div className="mb-4">
            <p>
              <strong>Medication:</strong> {selectedMedication?.productName}
            </p>
            <p>
              <strong>Details:</strong> {selectedMedication?.strength},
              {selectedMedication?.route}, {selectedMedication?.doseForm}
            </p>
          </div>
        ) : (
          <p>No medication selected</p>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
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
                <Button
                  type="submit"
                  className="bg-[#84012A] text-white hover:bg-[#6C011F]"
                >
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
