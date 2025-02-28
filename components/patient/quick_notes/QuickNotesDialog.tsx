import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import LoadingButton from "@/components/LoadingButton";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { showToast } from "@/utils/utils";
import { quickNotesSchema } from "@/schema/quickNotesSchema";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import {
  createQuickNote,
  updateQuickNotes,
} from "@/services/quickNotesServices";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

const QuickNotesDialog = ({
  userDetailsId,
  quickNotesData,
  isOpen,
  onClose,
  onFetchQuickNotes,
}: {
  userDetailsId: string;
  quickNotesData?: {
    notes: string;
    noteId: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onFetchQuickNotes: () => Promise<void>;
}) => {
  const providerDetails = useSelector((state: RootState) => state.login);

  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof quickNotesSchema>>({
    resolver: zodResolver(quickNotesSchema),
    defaultValues: {
      notes: quickNotesData?.notes || "",
    },
  });

  useEffect(() => {
    if (quickNotesData) {
      form.reset({
        notes: quickNotesData.notes,
      });
    }
  }, [quickNotesData, form]);

  const onSubmit = async (values: z.infer<typeof quickNotesSchema>) => {
    setLoading(true);
    try {
      if (quickNotesData) {
        const requestData = {
          notes: values.notes,
        };
        await updateQuickNotes({
          requestData: { note: requestData.notes },
          id: quickNotesData.noteId,
        });
      } else {
        const requestData = {
          note: values.notes,
          userDetailsId: userDetailsId,
          providerId: providerDetails.providerId,
        };
        await createQuickNote({ requestData });
      }
      showToast({
        toast,
        type: "success",
        message: `Note added successfully`,
      });
    } catch (e) {
      console.log("Error:", e);
      showToast({
        toast,
        type: "error",
        message: `Could not add note`,
      });
    } finally {
      setLoading(false);
      form.reset();
      onClose();
      await onFetchQuickNotes();
    }
  };

  if (loading) {
    return <LoadingButton />;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {quickNotesData ? "Update Notes" : "Add Notes"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ScrollArea className="max-h-[30rem] h-auto">
              <div >
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem >
                      <FormControl>
                        <Textarea {...field} className="resize-none" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter><Button>Save</Button></DialogFooter>
              </div>
            </ScrollArea>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default QuickNotesDialog;
