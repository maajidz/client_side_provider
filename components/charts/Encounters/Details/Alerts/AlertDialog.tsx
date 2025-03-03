import React, { useCallback, useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import LoadingButton from "@/components/LoadingButton";
import { Textarea } from "@/components/ui/textarea";
import { alertSchema } from "@/schema/alertSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createAlert,
  getAlertTypeData,
  updateAlertData,
} from "@/services/chartDetailsServices";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useToast } from "@/hooks/use-toast";
import { AlertTypeInterface } from "@/types/alertInterface";
import { showToast } from "@/utils/utils";
import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";
import { ScrollArea } from "@/components/ui/scroll-area";

const AlertDialog = ({
  userDetailsId,
  alertData,
  onClose,
  isOpen,
}: {
  userDetailsId: string;
  alertData?: {
    alertName: string;
    alertDescription: string;
    alertId: string;
  } | null;
  onClose: () => void;
  isOpen: boolean;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [alertTypeData, setAlertTypeData] = useState<AlertTypeInterface>();
  const providerDetails = useSelector((state: RootState) => state.login);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof alertSchema>>({
    resolver: zodResolver(alertSchema),
    defaultValues: {
      alertName: "",
      alertDescription: "",
    },
  });

  const fetchAlertTypeData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAlertTypeData({ page: 1, limit: 10 });
      if (response) {
        setAlertTypeData(response);
      }
    } catch (e) {
      console.log("Error", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlertTypeData();
  }, [fetchAlertTypeData]);

  useEffect(() => {
    if (alertData && alertTypeData) {
      const matchedAlertType = alertTypeData.data.find(
        (type) => type.alertName === alertData.alertName
      );
      form.reset({
        alertName: matchedAlertType?.id || "",
        alertDescription: alertData.alertDescription || "",
      });
    }
  }, [alertData, alertTypeData, form]);

  const onSubmit = async (values: z.infer<typeof alertSchema>) => {
    console.log("Form Values:", values);
    setLoading(true);
    try {
      if (alertData) {
        const requestData = {
          alertDescription: values.alertDescription,
        };
        await updateAlertData({
          requestData: requestData,
          id: alertData.alertId,
        });
      } else {
        const requestData = {
          alertTypeId: values.alertName,
          alertDescription: values.alertDescription,
          userDetailsId: userDetailsId,
          providerId: providerDetails.providerId,
        };
        await createAlert({ requestData: requestData });
      }
      showToast({
        toast,
        type: "success",
        message: `Alert added successfully`,
      });
    } catch (e) {
      console.log("Error:", e);
      showToast({ toast, type: "error", message: `Error` });
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
          <DialogTitle>{alertData ? "Update Alert" : "Add Alert"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ScrollArea className="max-h-[90dvh] h-auto">
              <div className="flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="alertName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alert Name</FormLabel>
                      <FormControl>
                        <Select
                          disabled={alertData ? true : false}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choose Alert from Master List" />
                          </SelectTrigger>
                          <SelectContent>
                            {alertTypeData?.data.map((typeData) => (
                              <SelectItem key={typeData.id} value={typeData.id}>
                                {typeData.alertName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="alertDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alert Description</FormLabel>
                      <FormControl>
                        <Textarea className="resize-none" {...field} />
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

export default AlertDialog;
