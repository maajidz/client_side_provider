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
import { Check, X } from "lucide-react";
import {
  createAlert,
  getAlertTypeData,
  updateAlertData,
} from "@/services/chartDetailsServices";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { UserEncounterData } from "@/types/chartsInterface";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { AlertTypeInterface } from "@/types/alertInterface";

const AlertDialog = ({
  patientDetails,
  alertData,
  onClose,
  isOpen,
}: {
  patientDetails: UserEncounterData;
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
      alertName: alertData?.alertName || "",
      alertDescription: alertData?.alertDescription || "",
    },
  });

  const fetchAlertTypeData = async () => {
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
  };

  useEffect(() => {
    if (alertData) {
      form.reset(alertData);
    }

    fetchAlertTypeData();
  }, [alertData, form]);

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
          userDetailsId: patientDetails.userDetails.id,
          providerId: providerDetails.providerId,
        };
        await createAlert({ requestData: requestData });
      }
      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-fit md:top-4 md:right-4"
        ),
        variant: "default",
        description: (
          <div className="flex flex-row items-center gap-4">
            <div className="flex bg-[#18A900] h-9 w-9 rounded-md items-center justify-center">
              <Check color="#FFFFFF" />
            </div>
            <div>Alert added successfully</div>
          </div>
        ),
      });
    } catch (e) {
      console.log("Error:", e);
      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-fit md:top-4 md:right-4"
        ),
        variant: "default",
        description: (
          <div className="flex flex-row items-center gap-4">
            <div className="flex bg-red-600 h-9 w-9 rounded-md items-center justify-center">
              <X color="#FFFFFF" />
            </div>
            <div>Error</div>
          </div>
        ),
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
          <DialogTitle>{alertData ? "Update Alert" : "Add Alert"}</DialogTitle>
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

export default AlertDialog;
