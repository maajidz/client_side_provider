import RadioButton from "@/components/custom_buttons/radio_button/RadioButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { insuranceType } from "@/constants/data";
import { useToast } from "@/hooks/use-toast";
import { insuranceFormSchema } from "@/schema/insuranceSchema";
import { createInsurance, updateInsurance } from "@/services/insuranceServices";
import {
  CreateInsuranceInterface,
  InsuranceResponse,
  UpdateInsuranceType,
} from "@/types/insuranceInterface";
import { showToast } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadCloudIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

interface InsuranceDialogProps {
  isOpen: boolean;
  userDetailsId: string;
  selectedIsInsured: string;
  selectedInsurance: InsuranceResponse | undefined;
  setIsOpen: (status: boolean) => void;
  setSelectedInsurance: (
    selectedInsurance: InsuranceResponse | undefined
  ) => void;
  setSelectedIsInsured: (value: string) => void;
  onFetchInsuranceData: () => Promise<void>;
}

function InsuranceDialog({
  isOpen,
  userDetailsId,
  selectedInsurance,
  selectedIsInsured,
  setIsOpen,
  setSelectedIsInsured,
  onFetchInsuranceData,
}: InsuranceDialogProps) {
  // Loading State
  const [loading, setLoading] = useState(false);
  const [selectedInsuranceType, setSelectedInsuranceType] = useState<string>(
    insuranceType[0]
  );

  // Toast State
  const { toast } = useToast();

  // Form State
  const methods = useForm({
    resolver: zodResolver(insuranceFormSchema),
    defaultValues: {
      companyName: selectedInsurance?.companyName ?? "",
      groupNameOrNumber: selectedInsurance?.groupNameOrNumber ?? "",
      subscriberNumber: selectedInsurance?.subscriberNumber ?? "",
      idNumber: selectedInsurance?.idNumber ?? "",
      frontDocumentImage: {} as File,
      backDocumentImage: {} as File,
    },
  });

  // Image State
  const [frontImageFile, setFrontImageFile] = useState<File>();
  const [backImageFile, setBackImageFile] = useState<File>();

  // Handle Dialog State
  const handleIsDialogOpen = (status: boolean) => {
    methods.reset();
    setIsOpen(status);
  };

  const handleInsuranceTypeChange = (value: string) => {
    setSelectedIsInsured(value);
    setSelectedInsuranceType(value);
    methods.reset();
  };

  // POST/PATCH Insurance State
  const toggleEdit = async () => {
    setLoading(true);
    const formValues = methods.getValues();
    console.log(formValues);

    const formData = new FormData();
    formData.append("type", selectedIsInsured);
    formData.append("companyName", formValues.companyName);
    formData.append("groupNameOrNumber", formValues.groupNameOrNumber);
    formData.append("subscriberNumber", formValues.subscriberNumber);
    formData.append("idNumber", formValues.idNumber);
    formData.append("status", "inactive");
    formData.append("userDetailsID", userDetailsId);
    formData.append("images", formValues.frontDocumentImage);
    formData.append("images", formValues.backDocumentImage);
    formData.append("notes", "");

    try {
      if (selectedInsurance) {
        updateInsurance({
          requestData: formData as unknown as UpdateInsuranceType,
          id: selectedInsurance.id,
        });
      } else {
        await createInsurance({
          requestData: formData as unknown as CreateInsuranceInterface,
        });
      }

      showToast({
        toast,
        type: "success",
        message: selectedInsurance
          ? "Insurance data updated successfully"
          : "Insurance data created successfully",
      });
    } catch (err) {
      if (err instanceof Error)
        return showToast({
          toast,
          type: "error",
          message: selectedInsurance
            ? "Insurance data update failed"
            : "Insurance data creation failed",
        });
    } finally {
      setLoading(false);
      setIsOpen(false);
      methods.reset();
      await onFetchInsuranceData();
    }
  };

  const handleFrontFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;

    if (selectedFile) {
      setFrontImageFile(selectedFile);
    }
  };

  const handleBackFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;

    if (selectedFile) {
      setBackImageFile(selectedFile);
    }
  };

  useEffect(() => {
    if (selectedInsurance) {
      methods.reset({
        companyName: selectedInsurance.companyName ?? "",
        groupNameOrNumber: selectedInsurance.groupNameOrNumber ?? "",
        subscriberNumber: selectedInsurance.subscriberNumber ?? "",
        idNumber: selectedInsurance.idNumber ?? "",
      });
      setSelectedInsuranceType(selectedInsurance.type);
    } else {
      methods.reset({
        // Reset form when adding new insurance
        companyName: "",
        groupNameOrNumber: "",
        subscriberNumber: "",
        idNumber: "",
      });
    }
  }, [methods, selectedInsurance]);

  return (
    <Dialog open={isOpen} onOpenChange={handleIsDialogOpen}>
      <DialogContent className="flex flex-col gap-8 max-w-[880px] max-h-[828px] w-full rounded-2xl overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>
            {!selectedInsurance
              ? "Add Insurance Data"
              : "Update Insurance Data"}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[30rem] min-h-30">
          <div className="flex flex-col gap-6 rounded-lg">
            {/* Form Fields */}
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-4">
                <Label
                  htmlFor="insuranceType"
                  className="text-[#344054] font-medium text-sm"
                >
                  Insurance Type
                </Label>
                <div className="flex flex-col items-start gap-2 md:flex-row">
                  {insuranceType.map((insurance, index) => (
                    <div key={index} className="w-96">
                      <RadioButton
                        label={insurance}
                        name={insurance}
                        value={insurance}
                        selectedValue={selectedInsuranceType}
                        onChange={handleInsuranceTypeChange}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <hr />
              <div>
                <FormProvider {...methods}>
                  <form onSubmit={methods.handleSubmit(toggleEdit)}>
                    <div className="flex flex-col gap-3">
                      <Label className="text-[rgba(132,1,42,1)] font-semibold text-base">
                        Enter Details
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Company Name */}
                        <FormField
                          control={methods.control}
                          name="companyName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[#344054] font-medium text-sm">
                                Company Name
                              </FormLabel>
                              <FormControl>
                                <Input {...field} className="w-full" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        {/* Group Name or Number */}
                        <FormField
                          control={methods.control}
                          name="groupNameOrNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[#344054] font-medium text-sm">
                                Group Name/Number
                              </FormLabel>
                              <FormControl>
                                <Input {...field} className="w-full" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        {/* Subscriber Number */}
                        <FormField
                          control={methods.control}
                          name="subscriberNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[#344054] font-medium text-sm">
                                Subscriber Number
                              </FormLabel>
                              <FormControl>
                                <Input {...field} className="w-full"  />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        {/* ID Number */}
                        <FormField
                          control={methods.control}
                          name="idNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[#344054] font-medium text-sm">
                                ID Number
                              </FormLabel>
                              <FormControl>
                                <Input {...field} className="w-full" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={methods.control}
                          name="frontDocumentImage"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel className="text-[#344054] font-medium text-sm">
                                Upload Front Side of Insurance Document
                              </FormLabel>
                              <FormControl>
                                <div className="flex flex-col justify-center border-[#B0BEC5] border-dashed border-2  rounded-md py-2">
                                  <label className="flex justify-center items-center text-[#84012A] font-semibold cursor-pointer">
                                    <div className="flex flex-col justify-center items-center p-3">
                                      <UploadCloudIcon
                                        className="border-[#D5D5D5] border-2 p-1 rounded-sm"
                                        color="#D5D5D5"
                                      />
                                      <div className="flex flex-row w-full gap-1">
                                        <div>Click to Upload</div>
                                        <div className="text-[#475467] font-normal">
                                          or drag and drop
                                        </div>
                                      </div>
                                      <div className="text-[#475467] font-normal">
                                        PNG, JPG, or JPEG (max. 800 x400px)
                                      </div>
                                    </div>
                                    <Input
                                      type="file"
                                      onChange={(event) => {
                                        const file = event.target.files?.[0];
                                        if (file) {
                                          field.onChange(file);
                                          handleFrontFileChange(event);
                                        }
                                      }}
                                      className="hidden"
                                    />
                                  </label>
                                  <div className="flex flex-1 justify-center items-center">
                                    {frontImageFile ? (
                                      <div>
                                        <Image
                                          src={URL.createObjectURL(
                                            frontImageFile as Blob
                                          )}
                                          width={24}
                                          height={24}
                                          alt="Front Side of Insurance"
                                          className="w-48 h-24 object-contain rounded-md"
                                        />
                                      </div>
                                    ) : (
                                      selectedInsurance && (
                                        <img
                                          alt={
                                            selectedInsurance.frontDocumentImage.split(
                                              "/"
                                            )[6]
                                          }
                                          src={
                                            selectedInsurance.frontDocumentImage
                                          }
                                          className="w-48 h-24 object-contain rounded-md"
                                        />
                                      )
                                    )}
                                  </div>
                                </div>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={methods.control}
                          name="backDocumentImage"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel className="text-[#344054] font-medium text-sm">
                                Upload Back Side of Insurance Document
                              </FormLabel>
                              <FormControl>
                                <div className="flex flex-col justify-center border-[#B0BEC5] border-dashed border-2 rounded-md py-2">
                                  <label className="flex justify-center items-center text-[#84012A] font-semibold cursor-pointer">
                                    <div className="flex flex-col justify-center items-center p-3">
                                      <UploadCloudIcon
                                        className="border-[#D5D5D5] border-2 p-1 rounded-sm"
                                        color="#D5D5D5"
                                      />
                                      <div className="flex flex-row w-full gap-1">
                                        <div>Click to Upload</div>
                                        <div className="text-[#475467] font-normal">
                                          or drag and drop
                                        </div>
                                      </div>
                                      <div className="text-[#475467] font-normal">
                                        PNG, JPG, or JPEG (max. 800 x400px)
                                      </div>
                                    </div>
                                    <Input
                                      type="file"
                                      onChange={(event) => {
                                        const file = event.target.files?.[0];
                                        if (file) {
                                          field.onChange(file);
                                          handleBackFileChange(event);
                                        }
                                      }}
                                      className="hidden"
                                    />
                                  </label>
                                  <div className="flex flex-1 justify-center items-center">
                                    {backImageFile ? (
                                      <div>
                                        <Image
                                          src={URL.createObjectURL(
                                            backImageFile as Blob
                                          )}
                                          width={24}
                                          height={24}
                                          alt="Back Side of Insurance"
                                          className="w-48 h-24 object-contain rounded-md"
                                        />
                                      </div>
                                    ) : (
                                      selectedInsurance && (
                                        <img
                                          alt={
                                            selectedInsurance.backDocumentImage.split(
                                              "/"
                                            )[6]
                                          }
                                          src={
                                            selectedInsurance.backDocumentImage
                                          }
                                          className="w-48 h-24 object-contain rounded-md"
                                        />
                                      )
                                    )}
                                  </div>
                                </div>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </form>
                </FormProvider>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex gap-2 justify-end">
              <>
                <Button
                  variant="outline"
                  onClick={() => handleIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button variant="default" onClick={toggleEdit} disabled={loading}>
                  {loading ? "Saving" : "Save"}
                </Button>
              </>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default InsuranceDialog;
