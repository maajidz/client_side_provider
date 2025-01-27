import React, { useCallback, useEffect, useState } from "react";
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
} from "@/services/chartDetailsServices";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useToast } from "@/hooks/use-toast";
import { AlertTypeInterface } from "@/types/alertInterface";
import { showToast } from "@/utils/utils";

const MessagesDialog = ({
  onClose,
  isOpen,
}: {
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
      alertName:  "",
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
  }, [ form, fetchAlertTypeData]);

  const onSubmit = async (values: z.infer<typeof alertSchema>) => {
    console.log("Form Values:", values);
    setLoading(true);
    try {
        const requestData = {
          alertTypeId: values.alertName,
          alertDescription: values.alertDescription,
          userDetailsId: "",
          providerId: providerDetails.providerId,
        };
        await createAlert({ requestData: requestData });
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
          <DialogTitle> Add Alert</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5">
              <FormField
                control={form.control}
                name="alertName"
                render={({ field }) => (
                  <FormItem className="flex">
                    <FormLabel className="w-fit">Alert Name</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value); 
                        }}
                        value={field.value}
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
                          {/* <SelectItem value="provider1">Provider 1</SelectItem>
                          <SelectItem value="provider2">Provider 2</SelectItem>
                          <SelectItem value="provider3">Provider 3</SelectItem> */}
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
                  <FormItem className="flex">
                    <FormLabel>Alert Description</FormLabel>
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

export default MessagesDialog;
