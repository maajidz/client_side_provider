import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { addMedicationFormSchema } from "@/schema/addMedicationSchema";
import { updateMedicationPrescription } from "@/services/chartDetailsServices";
import { MedicationPrescriptionInterface } from "@/types/medicationInterface";
import { showToast } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface EditMedicationPrescriptionProps {
  selectedPrescription: MedicationPrescriptionInterface;
  fetchPrescriptionData: () => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
};

function EditMedicationPrescription({
  selectedPrescription,
  fetchPrescriptionData,
}: EditMedicationPrescriptionProps) {
  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Loading State
  const [loading, setLoading] = useState(false);

  // Toast State
  const { toast } = useToast();

  // Form State
  const form = useForm<z.infer<typeof addMedicationFormSchema>>({
    resolver: zodResolver(addMedicationFormSchema),
    defaultValues: {
      directions: selectedPrescription?.directions || "",
      status: selectedPrescription?.status || "Active",
      fromDate:
        formatDate(selectedPrescription?.fromDate) ||
        new Date().toISOString().split("T")[0],
      toDate:
        formatDate(selectedPrescription?.toDate) ||
        new Date().toISOString().split("T")[0],
    },
  });

  // Modal Toggle Function
  const handleModalOpen = (open: boolean) => {
    if (!open) form.reset(selectedPrescription);
    setIsDialogOpen(open);
  };

  // PATCH Medication Prescription
  async function handleEditMedicationPrescription(
    values: z.infer<typeof addMedicationFormSchema>
  ) {
    setLoading(true);

    try {
      await updateMedicationPrescription({
        medicationPrescriptionId: selectedPrescription.id,
        requestData: {
          ...values,
          medicationNameId: selectedPrescription.id,
        },
      });

      showToast({
        toast,
        type: "success",
        message: "Medication prescription updated successfully",
      });
    } catch (err) {
      if (err instanceof Error) {
        showToast({
          toast,
          type: "error",
          message: "Could not update medication prescription",
        });
      }
    } finally {
      setLoading(false);
      form.reset();
      fetchPrescriptionData();
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleModalOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Edit2 color="#84012A" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle asChild>Edit Prescription</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="space-y-2"
            onSubmit={form.handleSubmit(handleEditMedicationPrescription)}
          >
            <div className="flex flex-col gap-5">
              <FormField
                control={form.control}
                name="directions"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel>Directions</FormLabel>
                    <FormControl>
                      <Textarea
                        defaultValue={selectedPrescription.directions}
                        onChange={field.onChange}
                      />
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
                        <Input
                          type="date"
                          defaultValue={formatDate(
                            selectedPrescription?.fromDate
                          )}
                          onChange={field.onChange}
                        />
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
                        <Input
                          type="date"
                          defaultValue={formatDate(
                            selectedPrescription?.toDate
                          )}
                          onChange={field.onChange}
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
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={selectedPrescription.status}
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
              <DialogFooter>
                <div className="flex justify-end gap-2 w-fit">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleModalOpen(false)}
                    className="bg-gray-100 text-gray-600"
                  >
                    Cancel
                  </Button>
                  <SubmitButton
                    label={loading ? "Saving" : "Save"}
                    disabled={loading}
                  />
                </div>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditMedicationPrescription;
