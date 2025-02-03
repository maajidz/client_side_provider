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
import {
  createPatientImplantedDevice,
  verifyImplantedDevices,
} from "@/services/implantedDevices";
import {
  CreateImplantedDevices,
  ImplantedDevices,
} from "@/types/implantedDevices";
import styles from "@/components/patient/patientDetails/patient_details/medical-history/implanted_devices/implantedDevices.module.css";
import DefaultButton from "@/components/custom_buttons/buttons/DefaultButton";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const ImplantedDevicesDialog = ({
  userDetailsId,
  implantedDeviceData,
  onClose,
  isOpen,
}: {
  userDetailsId: string;
  isOpen: boolean;
  implantedDeviceData?: null;
  onClose: () => void;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [showImplantedDeviceDetails, setShowImplantedDeviceDetails] =
    useState<boolean>(false);
  const [implantedDevices, setImplantedDevices] = useState<ImplantedDevices>();
  const providerDetails = useSelector((state: RootState) => state.login);
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
      const response = await verifyImplantedDevices({ udi: values.udi });
      if (response) {
        setShowImplantedDeviceDetails(true);
        setImplantedDevices(response);
      }
      // if (!implantedDeviceData) {
      //   const requestData = {
      //     udi: values.udi ?? "",
      //     userDetailsId,
      //   };
      //   console.log("Verify Data", requestData);
      //   // const response = await createProcedure({ requestData: requestData });
      //   // if (response) {
      //   //   showToast({
      //   //     toast,
      //   //     type: "success",
      //   //     message: "Added device successfully",
      //   //   });
      //   // }
      // } else {
      //   const requestData = {
      //     udi: values.udi ?? "",
      //     userDetailsId,
      //   };
      //   console.log("Update Data", requestData);
      //   // const response = await updateProcedureData({
      //   //   requestData: requestData,
      //   //   id: implantedDeviceData.id,
      //   // });
      //   // if (response) {
      //   //   showToast({
      //   //     toast,
      //   //     type: "success",
      //   //     message: "Edited procedure successfully",
      //   //   });
      //   // }
      // }
      // onClose();
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

  const addDevice = async () => {
    setLoading(true);
    const values = form.getValues();
    try {
      // if (!implantedDeviceData) {
      const requestData: CreateImplantedDevices = {
        UDI: values.udi,
        userDetailsId,
        providerId: providerDetails.providerId,
      };
      console.log("Create Device", requestData);
      const response = await createPatientImplantedDevice({
        requestData: requestData,
      });
      if (response) {
        showToast({
          toast,
          type: "success",
          message: "Device added successfully",
        });
      }
      // } else {
      //   const requestData = {
      //     udi: values.udi ?? "",
      //     userDetailsId,
      //   };
      //   console.log("Update Data", requestData);
      //   // const response = await updateProcedureData({
      //   //   requestData: requestData,
      //   //   id: implantedDeviceData.id,
      //   // });
      //   // if (response) {
      //   //   showToast({
      //   //     toast,
      //   //     type: "success",
      //   //     message: "Edited procedure successfully",
      //   //   });
      //   // }
      // }
      onClose();
    } catch (e) {
      console.log("Error:", e);
      showToast({
        toast,
        type: "error",
        message: "Failed to add a device",
      });
    } finally {
      setLoading(false);
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
          <DialogTitle>Add Device</DialogTitle>
        </DialogHeader>
        {showImplantedDeviceDetails ? (
          <div className="flex flex-col gap-3">
            <div className={`${styles.infoContainer}`}>
              <div className={`${styles.labelContainer}`}>
                <div className={`${styles.labelText}`}>UDI:</div>
                <div className={`${styles.valueText}`}>
                  {implantedDevices?.UDI ? implantedDevices?.UDI : "N/A"}
                </div>
              </div>
              <div className={`${styles.labelContainer}`}>
                <div className={`${styles.labelText}`}>Implant Name:</div>
                <div className={`${styles.valueText}`}>
                  {implantedDevices?.implant_name
                    ? implantedDevices?.implant_name
                    : "N/A"}
                </div>
              </div>
              <div className={`${styles.labelContainer}`}>
                <div className={`${styles.labelText}`}>Implant Date:</div>
                <div className={`${styles.valueText}`}>
                  {implantedDevices?.implant_date
                    ? implantedDevices?.implant_date.split("T")[0]
                    : "N/A"}
                </div>
              </div>
              <div className={`${styles.labelContainer}`}>
                <div className={`${styles.labelText}`}>Status:</div>
                <div className={`${styles.valueText}`}>
                  {implantedDevices?.status ? implantedDevices?.status : "N/A"}
                </div>
              </div>
              <div className={`${styles.labelContainer}`}>
                <div className={`${styles.labelText}`}>Brand Name:</div>
                <div className={`${styles.valueText}`}>
                  {implantedDevices?.brand_name
                    ? implantedDevices?.brand_name
                    : "N/A"}
                </div>
              </div>
              <div className={`${styles.labelContainer}`}>
                <div className={`${styles.labelText}`}>Version/Model:</div>
                <div className={`${styles.valueText}`}>
                  {implantedDevices?.version_or_model
                    ? implantedDevices?.version_or_model
                    : "N/A"}
                </div>
              </div>
              <div className={`${styles.labelContainer}`}>
                <div className={`${styles.labelText}`}>Company Name:</div>
                <div className={`${styles.valueText}`}>
                  {implantedDevices?.company_name
                    ? implantedDevices?.company_name
                    : "N/A"}
                </div>
              </div>
              <div className={`${styles.labelContainer}`}>
                <div className={`${styles.labelText}`}>MRI Compatible:</div>
                <div className={`${styles.valueText}`}>
                  {implantedDevices?.mri_compatible
                    ? implantedDevices?.mri_compatible
                    : "N/A"}
                </div>
              </div>
              <div className={`${styles.labelContainer}`}>
                <div className={`${styles.labelText}`}>Latex Content:</div>
                <div className={`${styles.valueText}`}>
                  {implantedDevices?.latex_content
                    ? implantedDevices?.latex_content
                    : "N/A"}
                </div>
              </div>
            </div>
            <DefaultButton onClick={addDevice}>Add Device</DefaultButton>
          </div>
        ) : (
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
                <SubmitButton label="Verify" />
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ImplantedDevicesDialog;
