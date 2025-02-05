import React, { useEffect, useState } from "react";
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
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addProceduresSurgeriesAndHospitalizationFormSchema } from "@/schema/addProceduresSurgeriesAndHospitalizationSchma";
import {
  createProcedure,
  updateProcedureData,
} from "@/services/chartDetailsServices";
import { UpdateProceduresInterface } from "@/types/procedureInterface";
import { useToast } from "@/components/ui/use-toast";
import LoadingButton from "@/components/LoadingButton";
import { showToast } from "@/utils/utils";
import SubmitButton from "@/components/custom_buttons/SubmitButton";
import formStyles from '@/components/formStyles.module.css';
import { ScrollArea } from "@/components/ui/scroll-area";

const ProceduresSurgeriesAndHospitalizationDialog = ({
  userDetailsId,
  procedureData,
  onClose,
  isOpen,
}: {
  userDetailsId: string;
  procedureData?: UpdateProceduresInterface | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const form = useForm<
    z.infer<typeof addProceduresSurgeriesAndHospitalizationFormSchema>
  >({
    resolver: zodResolver(addProceduresSurgeriesAndHospitalizationFormSchema),
    defaultValues: {
      type: procedureData?.type || "",
      name: procedureData?.name || "",
      fromDate:
        procedureData?.fromDate || new Date().toISOString().split("T")[0],
      toDate: procedureData?.toDate || new Date().toISOString().split("T")[0],
      notes: procedureData?.notes || "",
    },
  });

  useEffect(() => {
    if (procedureData) {
      form.reset({
        type: procedureData?.type || "",
        name: procedureData?.name || "",
        fromDate:
          procedureData?.fromDate || new Date().toISOString().split("T")[0],
        toDate: procedureData?.toDate || new Date().toISOString().split("T")[0],
        notes: procedureData?.notes || "",
      });
    }
  }, [procedureData, form]);

  const onSubmit = async (
    values: z.infer<typeof addProceduresSurgeriesAndHospitalizationFormSchema>
  ) => {
    setLoading(true);
    try {
      if (!procedureData) {
        const requestData = {
          type: values.type ?? "",
          name: values.name,
          fromDate: values.fromDate ?? "",
          toDate: values.toDate ?? "",
          notes: values.notes ?? "",
          userDetailsId,
        };
        const response = await createProcedure({ requestData: requestData });
        if (response) {
          showToast({
            toast,
            type: "success",
            message: "Added procedure successfully",
          });
        }
      } else {
        const requestData = {
          type: values.type ?? "",
          name: values.name,
          fromDate: values.fromDate ?? "",
          toDate: values.toDate ?? "",
          notes: values.notes ?? "",
          userDetailsId,
        };
        const response = await updateProcedureData({
          requestData: requestData,
          id: procedureData.id,
        });
        if (response) {
          showToast({
            toast,
            type: "success",
            message: "Edited procedure successfully",
          });
        }
      }
      onClose();
    } catch (e) {
      console.log("Error:", e);
      showToast({
        toast,
        type: "error",
        message: "Failed to create a procedure",
      });
    } finally {
      setLoading(false);
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
            {procedureData ? "Update Procedure" : "Add Procedure"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
          <ScrollArea className="max-h-[30rem] h-auto">
            <div className={formStyles.formBody}>
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className={formStyles.formItem}>
                    <FormLabel className="w-fit">Type</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="procedure">Procedure</SelectItem>
                          <SelectItem value="surgeries">Surgeries</SelectItem>
                          <SelectItem value="hospitalization">
                            Hospitalization
                          </SelectItem>
                          <SelectItem value="other_events">
                            Other Events
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
                name="name"
                render={({ field }) => (
                  <FormItem className={formStyles.formItem}>
                    <FormLabel className="w-fit">Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fromDate"
                render={({ field }) => (
                  <FormItem className={formStyles.formItem}>
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
                  <FormItem className={formStyles.formItem}>
                    <FormLabel>To Date:</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className={formStyles.formItem}>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <SubmitButton label="Save" />
            </div>
          </ScrollArea>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProceduresSurgeriesAndHospitalizationDialog;
