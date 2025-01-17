import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
import { createQuickNote } from "@/services/quickNotesServices";

const QuickNotesDialog = ({
  userDetailsId,
  quickNotesData,
  onClose,
  isOpen,
}: {
  userDetailsId: string;
  quickNotesData?: {
    notes: string;
    noteId: string;
  } | null;
  onClose: () => void;
  isOpen: boolean;
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
        // const requestData = {
        //   notes: values.notes,
        // };
        // await updateAlertData({
        //   requestData: requestData,
        //   id: alertData.alertId,
        // });
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
        message: `Quick note added successfully`,
      });
    } catch (e) {
      console.log("Error:", e);
      showToast({
        toast,
        type: "error",
        message: `Could not add quick note`,
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {quickNotesData ? "Update Quick Notes" : "Add Quick Notes"}
          </DialogTitle>
        </DialogHeader>
        {userDetailsId}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5">
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="flex">
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="bg-[#84012A]">
                Save
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default QuickNotesDialog;
