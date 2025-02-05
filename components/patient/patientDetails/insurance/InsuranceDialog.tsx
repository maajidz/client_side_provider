import RadioButton from "@/components/custom_buttons/radio_button/RadioButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { isInsured } from "@/constants/data";
import { useToast } from "@/hooks/use-toast";
import { insuranceFormSchema } from "@/schema/insuranceSchema";
import { createInsurance } from "@/services/insuranceServices";
import { InsuranceResponse } from "@/types/insuranceInterface";
import { showToast } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { PlusIcon, UploadCloudIcon } from "lucide-react";
import Image from "next/image";
// import { UploadCloudIcon } from "lucide-react";
// import Image from "next/image";
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
}

function InsuranceDialog({
  isOpen,
  userDetailsId,
  selectedInsurance,
  selectedIsInsured,
  setIsOpen,
  setSelectedInsurance,
  setSelectedIsInsured,
}: InsuranceDialogProps) {
  // Loading State
  const [loading, setLoading] = useState(false);

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
      frontDocumentImage: [] as File[],
      backDocumentImage: [] as File[],
    },
  });

  // Image State
  const [frontImageFile, setFrontImageFile] = useState<File | null>(null);
  const [backImageFile, setBackImageFile] = useState<File | null>(null);

  // Handle Dialog State
  const handleIsDialogOpen = (status: boolean) => {
    setIsOpen(status);
  };

  const handleInsuranceTypeChange = (value: string) => {
    setSelectedIsInsured(value);
    methods.reset();
  };

  // POST/PATCH Insurance State
  const toggleEdit = async () => {
    const formValues = methods.getValues();

    const requestData = {
      type: selectedIsInsured,
      companyName: formValues.companyName,
      groupNameOrNumber: formValues.groupNameOrNumber,
      subscriberNumber: formValues.subscriberNumber,
      idNumber: formValues.idNumber,
      status: "Inactive",
      images: [
        frontImageFile ? [frontImageFile] : [],
        backImageFile ? [backImageFile] : [],
      ],
      userDetailsID: userDetailsId,
    };
    try {
      // TODO: Update API Pending
      if (selectedInsurance) {
        console.log("Insurance data updated.");
      } else {
      }
      await createInsurance({ requestData });

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
      methods.reset();
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
      <DialogTrigger asChild>
        <Button
          className="flex items-center bg-[#84012A] hover:bg-[#84012A]"
          onClick={() => {
            setSelectedInsurance(undefined);
            setIsOpen(true);
          }}
        >
          <PlusIcon />
          Insurance
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-8 p-6 max-w-[880px] max-h-[828px] w-full rounded-2xl overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>
            {!selectedInsurance
              ? "Add Insurance Data"
              : "Update Insurance Data"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[30rem] min-h-[30rem]">
          <div className="flex flex-col gap-6 p-6 rounded-lg">
            {/* Action Buttons */}
            <div className="flex gap-2 justify-end">
              <>
                <Button
                  variant="outline"
                  onClick={() => handleIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="text-white border-[rgba(132,1,42,1)] bg-[rgba(132,1,42,1)] h-6 p-4 hover:bg-[#84012A]"
                  disabled={loading}
                  onClick={toggleEdit}
                >
                  Save
                </Button>
              </>
            </div>

            {/* Form Fields */}
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <Label
                  htmlFor="insuranceType"
                  className="text-[#344054] font-medium text-sm"
                >
                  Insurance Type
                </Label>
                <div className="flex flex-col items-start gap-2 md:flex-row">
                  {isInsured.map((insurance, index) => (
                    <div key={index} className="w-96">
                      <RadioButton
                        label={insurance.isInsured}
                        name={insurance.isInsured}
                        value={insurance.isInsured}
                        selectedValue={selectedIsInsured}
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
                    <div className="flex flex-col gap-6">
                      <Label className="text-[rgba(132,1,42,1)] font-semibold text-base">
                        Enter Details
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Company Name */}
                        <FormField
                          control={methods.control}
                          name="companyName"
                          render={({ field }) => (
                            <FormItem className="w-64">
                              <FormLabel className="text-[#344054] font-medium text-sm">
                                Company Name
                              </FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        {/* Group Name or Number */}
                        <FormField
                          control={methods.control}
                          name="groupNameOrNumber"
                          render={({ field }) => (
                            <FormItem className="w-64">
                              <FormLabel className="text-[#344054] font-medium text-sm">
                                Group Name/Number
                              </FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        {/* Subscriber Number */}
                        <FormField
                          control={methods.control}
                          name="subscriberNumber"
                          render={({ field }) => (
                            <FormItem className="w-64">
                              <FormLabel className="text-[#344054] font-medium text-sm">
                                Subscriber Number
                              </FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        {/* ID Number */}
                        <FormField
                          control={methods.control}
                          name="idNumber"
                          render={({ field }) => (
                            <FormItem className="w-64">
                              <FormLabel className="text-[#344054] font-medium text-sm">
                                ID Number
                              </FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={methods.control}
                          name="frontDocumentImage"
                          render={() => (
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
                                    <input
                                      type="file"
                                      onChange={handleFrontFileChange}
                                      className="hidden"
                                    />
                                  </label>
                                  <div className="flex flex-1 justify-center items-center">
                                    {frontImageFile && (
                                      <div>
                                        <Image
                                          src={URL.createObjectURL(
                                            frontImageFile as Blob
                                          )}
                                          alt="Front Side of Insurance"
                                          className="w-48 h-24 object-contain rounded-md"
                                        />
                                      </div>
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
                          render={() => (
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
                                    <input
                                      type="file"
                                      onChange={handleBackFileChange}
                                      className="hidden"
                                    />
                                  </label>
                                  <div className="flex flex-1 justify-center items-center">
                                    {backImageFile && (
                                      <div>
                                        <Image
                                          src={URL.createObjectURL(
                                            backImageFile as Blob
                                          )}
                                          alt="BAck Side of Insurance"
                                          className="w-48 h-24 object-contain rounded-md"
                                        />
                                      </div>
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
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default InsuranceDialog;
