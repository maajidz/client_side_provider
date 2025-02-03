import SubmitButton from "@/components/custom_buttons/SubmitButton";
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
import { useToast } from "@/components/ui/use-toast";
import React, { useState } from "react";
import formStyles from "@/components/formStyles.module.css";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addImplantedDevicesSchema } from "@/schema/addImplantedDevicesSchema";
import { Input } from "@/components/ui/input";
import { showToast } from "@/utils/utils";
import LoadingButton from "@/components/LoadingButton";

const ImplantedDevicesDialog = ({
  userDetailsId,
  implantedDeviceData,
  onClose,
  isOpen,
}: {
  userDetailsId: string;
  isOpen: boolean;
  implantedDeviceData?: null
  onClose: () => void;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof addImplantedDevicesSchema>>({
    resolver: zodResolver(addImplantedDevicesSchema),
    defaultValues: {
      udi: implantedDeviceData || "",
    },
  });

  const onSubmit = async (
    values: z.infer<typeof addImplantedDevicesSchema>
  ) => {
    setLoading(true);
    try {
      if (!implantedDeviceData) {
        const requestData = {
          udi: values.udi ?? "",
          userDetailsId,
        };
        console.log("Create Data", requestData);
        // const response = await createProcedure({ requestData: requestData });
        // if (response) {
        //   showToast({
        //     toast,
        //     type: "success",
        //     message: "Added device successfully",
        //   });
        // }
      } else {
        const requestData = {
          udi: values.udi ?? "",
          userDetailsId,
        };
        console.log("Update Data", requestData);
        // const response = await updateProcedureData({
        //   requestData: requestData,
        //   id: implantedDeviceData.id,
        // });
        // if (response) {
        //   showToast({
        //     toast,
        //     type: "success",
        //     message: "Edited procedure successfully",
        //   });
        // }
      }
      onClose();
    } catch (e) {
      console.log("Error:", e);
      showToast({
        toast,
        type: "error",
        message: "Failed to add a  device",
      });
    } finally {
      setLoading(false);
    }
  };

  if(loading) {
    return <LoadingButton />
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Device</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5">
              <FormField
                control={form.control}
                name="udi"
                render={({ field }) => (
                  <FormItem className={formStyles.formItem}>
                    <FormLabel className="w-fit">UID</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
};

export default ImplantedDevicesDialog;
