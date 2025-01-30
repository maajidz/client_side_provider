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
import { isInsured } from "@/constants/data";
import { useToast } from "@/hooks/use-toast";
import { insuranceFormSchema } from "@/schema/insuranceSchema";
import { createInsurance } from "@/services/insuranceServices";
import { InsuranceResponse } from "@/types/insuranceInterface";
import { showToast } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { PlusIcon, Edit2Icon } from "lucide-react";
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
  // Edit State
  const [isEditable, setIsEditable] = useState(false);

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
      // frontDocumentImage: [] as File[],
      // backDocumentImage: [] as File[],
    },
  });

  // Image State
  // const [frontImageFile, setFrontImageFile] = useState<File | null>(null);
  // const [backImageFile, setBackImageFile] = useState<File | null>(null);

  // Handle Dialog State
  const handleIsDialogOpen = (status: boolean) => {
    setIsOpen(status);
    if (status === false) {
      setIsEditable(false);
    }
  };

  const handleInsuranceTypeChange = (value: string) => {
    setSelectedIsInsured(value);
    setIsEditable(false);
    methods.reset();
  };

  // POST/PATCH Insurance State
  const toggleEdit = async () => {
    const formValues = methods.getValues();
    if (isEditable) {
      const requestData = {
        type: selectedIsInsured,
        companyName: formValues.companyName,
        groupNameOrNumber: formValues.groupNameOrNumber,
        subscriberNumber: formValues.subscriberNumber,
        idNumber: formValues.idNumber,
        status: "Inactive",
        // images: [
        //   frontImageFile ? [frontImageFile] : [],
        //   backImageFile ? [backImageFile] : [],
        // ],
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
    }
    setIsEditable(!isEditable);
  };

  // const handleBackFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const selectedFile = e.target.files ? e.target.files[0] : null;

  //   if (selectedFile) {
  //     setBackImageFile(selectedFile);
  //   }
  // };

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
        <div className="flex flex-col gap-6 p-6 border rounded-lg">
          {/* Action Buttons */}
          <div className="flex gap-2 justify-end">
            {isEditable || !selectedInsurance ? (
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
            ) : (
              <Button
                className="text-white border-[rgba(132,1,42,1)] bg-[rgba(132,1,42,1)] h-6 p-4 hover:bg-[#84012A]"
                onClick={() => setIsEditable(true)}
              >
                <div className="flex items-center gap-2">
                  <Edit2Icon />
                  Edit
                </div>
              </Button>
            )}
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
              <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
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
                              <Input
                                disabled={!isEditable && !!selectedInsurance}
                                {...field}
                              />
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
                              <Input
                                disabled={!isEditable && !!selectedInsurance}
                                {...field}
                              />
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
                              <Input
                                disabled={!isEditable && !!selectedInsurance}
                                {...field}
                              />
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
                              <Input
                                disabled={!isEditable && !!selectedInsurance}
                                {...field}
                              />
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
      </DialogContent>
    </Dialog>
  );
}

export default InsuranceDialog;

