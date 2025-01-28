import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
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
import { UserEncounterData } from "@/types/chartsInterface";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CreatePastMedicalHistoryType } from "@/services/pastMedicalHistoryInterface";
import { createPastMedicalHistory } from "@/services/chartDetailsServices";
import { showToast } from "@/utils/utils";
import SubmitButton from "@/components/custom_buttons/SubmitButton";

interface PastMedicalHistoryDialogProps {
  patientDetails: UserEncounterData;
}

function PastMedicalHistoryDialog({
  patientDetails,
}: PastMedicalHistoryDialogProps) {
  // Loading State
  const [loading, setLoading] = useState<boolean>(false);

  // Toast State
  const { toast } = useToast();

  const form = useForm<z.infer<typeof addPastMedicalHistorySchema>>({
    resolver: zodResolver(addPastMedicalHistorySchema),
    defaultValues: {
      notes: "",
      glp_refill_note_practice: "",
    },
  });

  // POST Past Medical History
  const onSubmit = async (
    values: z.infer<typeof addPastMedicalHistorySchema>
  ) => {
    const requestData: CreatePastMedicalHistoryType = {
      notes: values.notes,
      glp_refill_note_practice: values.glp_refill_note_practice,
      userDetailsId: patientDetails.userDetails.id,
    };

    setLoading(true);
    try {
      await createPastMedicalHistory({ requestData });

      showToast({
        toast,
        type: "success",
        message: "Past medical history created successfully",
      });
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
      form.reset();
    }
  };

  if (loading) {
    return <LoadingButton />;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <PlusCircle />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Past Medical History</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5">
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="flex gap-2 items-center">
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
                  <FormItem className="flex gap-2 items-center">
                    <FormLabel>GLP Refill Note Practice - PMH</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <SubmitButton label="Save" />
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default PastMedicalHistoryDialog;
