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
import { Eye, FileIcon, Upload, X } from "lucide-react";
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
      setFrontImageFile(undefined);
      setBackImageFile(undefined);
    }
  }, [methods, selectedInsurance]);

  const previewFile = (preview: string) => {
    window.open(preview, "_blank");
  };

  const removeFrontFile = () => {
    setFrontImageFile(undefined);
  };

  const removeBackFile = () => {
    setBackImageFile(undefined);
  };

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
                                <Input {...field} className="w-full" />
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
                        {/* Front Document Image */}
                        <FormField
                          control={methods.control}
                          name="frontDocumentImage"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel className="text-[#344054] font-medium text-sm">
                                Upload Front Side of Insurance Document
                              </FormLabel>
                              <FormControl>
                                <div className="w-full space-y-2">
                                  <label>
                                    <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors">
                                      <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
                                      <p className="text-sm font-medium">
                                        Click to select files
                                      </p>
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
                                  {frontImageFile && (
                                    <div className="bg-card rounded-lg p-3 shadow-sm border">
                                      <div className="flex items-center justify-between mb-2">
                                        <p className="text-sm font-medium truncate">
                                          {frontImageFile?.name}
                                        </p>
                                        <div className="flex items-center gap-2">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                              previewFile(
                                                URL.createObjectURL(
                                                  frontImageFile as Blob
                                                )
                                              )
                                            }
                                          >
                                            <Eye className="w-4 h-4" />
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-5 w-5 p-0 rounded-full"
                                            onClick={() => removeFrontFile()}
                                          >
                                            <X className="w-3 h-3" />
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {selectedInsurance?.frontDocumentImage && (
                                    <div className="space-y-1">
                                      <h4 className="text-sm font-medium">
                                        Uploaded Files
                                      </h4>
                                      <div className="flex flex-wrap gap-2">
                                        <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-full text-xs">
                                          <FileIcon className="w-3.5 h-3.5" />
                                          <span className="truncate max-w-[150px]">
                                            {
                                              selectedInsurance?.frontDocumentImage.split(
                                                "/"
                                              )[6]
                                            }
                                          </span>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-5 w-5 p-0 rounded-full"
                                            type="button"
                                            onClick={() =>
                                              previewFile(
                                                selectedInsurance?.frontDocumentImage
                                              )
                                            }
                                          >
                                            <Eye className="w-3 h-3" />
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        {/* Back Document Image */}
                        <FormField
                          control={methods.control}
                          name="backDocumentImage"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel className="text-[#344054] font-medium text-sm">
                                Upload Back Side of Insurance Document
                              </FormLabel>
                              <FormControl>
                                <div className="w-full space-y-2">
                                  <label>
                                    <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors">
                                      <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
                                      <p className="text-sm font-medium">
                                        Click to select files
                                      </p>
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
                                  {backImageFile && (
                                    <div className="bg-card rounded-lg p-3 shadow-sm border">
                                      <div className="flex items-center justify-between mb-2">
                                        <p className="text-sm font-medium truncate">
                                          {backImageFile?.name}
                                        </p>
                                        <div className="flex items-center gap-2">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                              previewFile(
                                                URL.createObjectURL(
                                                  backImageFile as Blob
                                                )
                                              )
                                            }
                                          >
                                            <Eye className="w-4 h-4" />
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-5 w-5 p-0 rounded-full"
                                            onClick={() => removeBackFile()}
                                          >
                                            <X className="w-3 h-3" />
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {selectedInsurance?.backDocumentImage && (
                                    <div className="space-y-1">
                                      <h4 className="text-sm font-medium">
                                        Uploaded Files
                                      </h4>
                                      <div className="flex flex-wrap gap-2">
                                        <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-full text-xs">
                                          <FileIcon className="w-3.5 h-3.5" />
                                          <span className="truncate max-w-[150px]">
                                            {
                                              selectedInsurance.backDocumentImage.split(
                                                "/"
                                              )[6]
                                            }
                                          </span>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-5 w-5 p-0 rounded-full"
                                            type="button"
                                            onClick={() =>
                                              previewFile(
                                                selectedInsurance?.backDocumentImage
                                              )
                                            }
                                          >
                                            <Eye className="w-3 h-3" />
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  )}
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
                <Button
                  variant="default"
                  onClick={toggleEdit}
                  disabled={loading}
                >
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
