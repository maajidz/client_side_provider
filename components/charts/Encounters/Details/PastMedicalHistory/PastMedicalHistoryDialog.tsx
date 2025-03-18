import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { addPastMedicalHistorySchema } from "@/schema/addPastMedicalHistorySchema";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  CreatePastMedicalHistoryType,
  PastMedicalHistoryInterface,
} from "@/services/pastMedicalHistoryInterface";
import {
  createPastMedicalHistory,
  updatePastMedicalHistory,
} from "@/services/chartDetailsServices";
import { showToast } from "@/utils/utils";
import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";

interface PastMedicalHistoryDialogProps {
  isOpen: boolean;
  userDetailsId: string;
  onClose: () => void;
  selectedMedicaHistory?: PastMedicalHistoryInterface | null;
}

function PastMedicalHistoryDialog({
  isOpen,
  userDetailsId,
  onClose,
  selectedMedicaHistory,
}: PastMedicalHistoryDialogProps) {
  // Loading State
  const [loading, setLoading] = useState<boolean>(false);

  // Toast State
  const { toast } = useToast();

  // Form Definition
  const form = useForm<z.infer<typeof addPastMedicalHistorySchema>>({
    resolver: zodResolver(addPastMedicalHistorySchema),
    defaultValues: {
      notes: selectedMedicaHistory?.notes ?? "",
      glp_refill_note_practice:
        selectedMedicaHistory?.glp_refill_note_practice ?? "",
    },
  });

  useEffect(() => {
    if (selectedMedicaHistory) {
      form.reset({
        notes: selectedMedicaHistory.notes ?? "",
        glp_refill_note_practice:
          selectedMedicaHistory.glp_refill_note_practice ?? "",
      });
    }
  }, [selectedMedicaHistory, form]);

  // POST Past Medical History
  const onSubmit = async (
    values: z.infer<typeof addPastMedicalHistorySchema>
  ) => {
    const requestData: CreatePastMedicalHistoryType = {
      notes: values.notes,
      glp_refill_note_practice: values.glp_refill_note_practice,
      userDetailsId,
    };

    setLoading(true);
    try {
      if (!selectedMedicaHistory) {
        await createPastMedicalHistory({ requestData });

        showToast({
          toast,
          type: "success",
          message: "Past medical history created successfully",
        });
      } else {
        await updatePastMedicalHistory({
          requestData,
          id: selectedMedicaHistory.id,
        });

        showToast({
          toast,
          type: "success",
          message: "Past medical history updated successfully",
        });
      }
    } catch (err) {
      if (err instanceof Error) {
        showToast({
          toast,
          type: "error",
          message: "Past medical history creation failed",
        });
      }
    } finally {
      setLoading(false);
      onClose();
      form.reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Past Medical History</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-fit">Note</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="glp_refill_note_practice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GLP Refill Note Practice - PMH</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SubmitButton
              label={loading ? "Saving..." : "Save"}
              disabled={loading}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default PastMedicalHistoryDialog;
