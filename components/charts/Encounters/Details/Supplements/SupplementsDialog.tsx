import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";
import formStyles from "@/components/formStyles.module.css";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { supplementsFormSchema } from "@/schema/supplementsSchema";
import {
  createSupplement,
  getAllSupplementTypes,
  updateSupplement,
} from "@/services/chartDetailsServices";
import {
  SupplementInterfaceResponse,
  SupplementTypesInterface,
  UpdateSupplementType,
} from "@/types/supplementsInterface";
import { showToast } from "@/utils/utils";
import { useForm } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import {
  getDosageUnits,
  getFrequencyData,
  getIntakeTypes,
} from "@/services/enumServices";

function SupplementsDialog({
  userDetailsId,
  onClose,
  isOpen,
  selectedSupplement,
}: {
  userDetailsId: string;
  onClose: () => void;
  isOpen: boolean;
  selectedSupplement?: SupplementInterfaceResponse | null;
}) {
  // Supplements State
  const [supplementsData, setSupplementsData] = useState<
    SupplementTypesInterface[]
  >([]);
  // Search Supplement States
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isListVisible, setIsListVisible] = useState(false);

  // Frequency Data
  const [frequencyData, setFrequencyData] = useState<string[]>([]);

  // Dosage Units
  const [dosageUnits, setDosageUnits] = useState<string[]>([]);

  // Intake Types
  const [intakeTypes, setIntakeTypes] = useState<string[]>([]);

  // Loading State
  const [loading, setLoading] = useState({
    get: false,
    post: false,
    frequency: false,
    dosage: false,
    intake: false,
  });

  // Toast State
  const { toast } = useToast();

  // GET Supplements List
  const fetchAllSupplements = useCallback(async () => {
    setLoading((prev) => ({ ...prev, get: true }));

    try {
      const response = await getAllSupplementTypes();

      if (response) {
        setSupplementsData(response.data);
      }
    } catch (err) {
      if (err instanceof Error) {
        showToast({
          toast,
          type: "error",
          message: "Could not fetch supplements data",
        });
      }
    } finally {
      setLoading((prev) => ({ ...prev, get: false }));
    }
  }, [toast]);

  const form = useForm<z.infer<typeof supplementsFormSchema>>({
    resolver: zodResolver(supplementsFormSchema),
    defaultValues: {
      supplement: selectedSupplement?.supplementId || "",
      manufacturer: selectedSupplement?.manufacturer || "",
      fromDate:
        selectedSupplement?.fromDate.split("T")[0] ||
        new Date().toISOString().split("T")[0],
      toDate:
        selectedSupplement?.toDate.split("T")[0] ||
        new Date().toISOString().split("T")[0],
      status: selectedSupplement?.status || "Active",
      dosage: selectedSupplement?.dosage || "",
      unit: selectedSupplement?.unit || "",
      frequency: selectedSupplement?.frequency || "",
      intake_type: selectedSupplement?.intake_type || "",
      comments: selectedSupplement?.comments || "",
    },
  });

  // GET Frequency Data
  const fetchFrequency = useCallback(async () => {
    setLoading((prev) => ({ ...prev, frequency: true }));

    try {
      const response = await getFrequencyData();

      if (response) {
        setFrequencyData(response);
      }
    } catch (err) {
      if (err instanceof Error) {
        showToast({
          toast,
          type: "error",
          message: "Could not fetch frequency data",
        });
      } else {
        showToast({
          toast,
          type: "error",
          message: "An unknown error occurred",
        });
      }
    } finally {
      setLoading((prev) => ({ ...prev, frequency: false }));
    }
  }, [toast]);

  // GET Dosage Units
  const fetchDosageUnits = useCallback(async () => {
    setLoading((prev) => ({ ...prev, dosage: true }));

    try {
      const response = await getDosageUnits();

      if (response) {
        setDosageUnits(response);
      }
    } catch (err) {
      if (err instanceof Error) {
        showToast({
          toast,
          type: "error",
          message: "Could not fetch dosage units",
        });
      } else {
        showToast({
          toast,
          type: "error",
          message: "An unknown error occurred",
        });
      }
    } finally {
      setLoading((prev) => ({ ...prev, dosage: false }));
    }
  }, [toast]);

  // GET Intake Types
  const fetchIntakeTypes = useCallback(async () => {
    setLoading((prev) => ({ ...prev, intake: true }));

    try {
      const response = await getIntakeTypes();

      if (response) {
        setIntakeTypes(response);
      }
    } catch (err) {
      if (err instanceof Error) {
        showToast({
          toast,
          type: "error",
          message: "Could not fetch intake types data",
        });
      } else {
        showToast({
          toast,
          type: "error",
          message: "An unknown error occurred",
        });
      }
    } finally {
      setLoading((prev) => ({ ...prev, intake: false }));
    }
  }, [toast]);

  // POST Supplement
  const onSubmit = async (values: z.infer<typeof supplementsFormSchema>) => {
    setLoading((prev) => ({ ...prev, post: true }));

    const requestData: UpdateSupplementType = {
      supplementId: values.supplement,
      supplement: values.supplement,
      manufacturer: values.manufacturer,
      fromDate: values.fromDate,
      toDate: values.toDate,
      status: values.status,
      dosage: values.dosage,
      unit: values.unit,
      frequency: values.frequency,
      intake_type: values.intake_type,
      comments: values.comments,
      userDetailsId: userDetailsId,
    };

    try {
      if (!selectedSupplement) {
        await createSupplement({ requestData: requestData });

        showToast({
          toast,
          type: "success",
          message: "Supplement created successfully",
        });
      } else {
        await updateSupplement({
          requestData: requestData,
          supplementId: selectedSupplement?.id,
        });

        showToast({
          toast,
          type: "success",
          message: "Supplement updated successfully",
        });
      }
    } catch (err) {
      console.log("Error", err);
      showToast({
        toast,
        type: "error",
        message: "Supplement creation failed",
      });
    } finally {
      setLoading((prev) => ({ ...prev, post: false }));
      form.reset();
      onClose();
    }
  };

  useEffect(() => {
    fetchAllSupplements();
    fetchFrequency();
    fetchDosageUnits();
    fetchIntakeTypes();
  }, [fetchAllSupplements, fetchFrequency, fetchDosageUnits, fetchIntakeTypes]);

  useEffect(() => {
    if (selectedSupplement) {
      form.reset({
        supplement: selectedSupplement?.supplementId || "",
        manufacturer: selectedSupplement?.manufacturer || "",
        fromDate:
          selectedSupplement?.fromDate.split("T")[0] ||
          new Date().toISOString().split("T")[0],
        toDate:
          selectedSupplement?.toDate.split("T")[0] ||
          new Date().toISOString().split("T")[0],
        status: selectedSupplement?.status || "Active",
        dosage: selectedSupplement?.dosage || "",
        unit: selectedSupplement?.unit || "",
        frequency: selectedSupplement?.frequency || "",
        intake_type: selectedSupplement?.intake_type || "",
        comments: selectedSupplement?.comments || "",
      });

      if (selectedSupplement.type.supplement_name) {
        setSearchTerm(selectedSupplement.type.supplement_name);
      }
    }
  }, [selectedSupplement, form]);

  const filteredSupplements = supplementsData.filter((supplement) =>
    supplement.supplement_name.toLocaleLowerCase().includes(searchTerm)
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[465px]">
        <DialogHeader>
          <p>
            {selectedSupplement ? "Edit Supplement" : "Add Supplement"}
          </p>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[30rem] max-h-[30rem] p-2.5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className={formStyles.formBody}>
                <FormField
                  control={form.control}
                  name="supplement"
                  render={({ field }) => (
                    <FormItem className={formStyles.formItem}>
                      <FormLabel>Supplement</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            value={searchTerm || field.value}
                            placeholder="Search Supplement..."
                            onChange={(event) => {
                              setSearchTerm(event.target.value);
                              setIsListVisible(true);
                            }}
                            className="w-full"
                          />
                          {searchTerm && isListVisible && (
                            <div className="absolute bg-white border border-gray-300 mt-1 rounded shadow-lg  w-full">
                              {filteredSupplements.length > 0 ? (
                                filteredSupplements.map((supplement) => (
                                  <div
                                    key={supplement.id}
                                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                    onClick={() => {
                                      field.onChange(supplement.id);
                                      setSearchTerm(supplement.supplement_name);
                                      setIsListVisible(false);
                                    }}
                                  >
                                    {supplement.supplement_name}
                                  </div>
                                ))
                              ) : (
                                <div className="px-4 py-2 text-gray-500">
                                  No results found
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="manufacturer"
                  render={({ field }) => (
                    <FormItem className={formStyles.formItem}>
                      <FormLabel className="w-fit">Manufacturer</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choose Manufacturer" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="love_wellness">
                              Love Wellness
                            </SelectItem>
                            <SelectItem value="manufacturer2">
                              Manufacturer 2
                            </SelectItem>
                            <SelectItem value="manufacturer3">
                              Manufacturer 3
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-between gap-3">
                  <FormField
                    control={form.control}
                    name="fromDate"
                    render={({ field }) => (
                      <FormItem className={`${formStyles.formItem} w-full`}>
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
                      <FormItem className={`${formStyles.formItem} w-full`}>
                        <FormLabel>To Date:</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className={formStyles.formItem}>
                      <FormLabel className="w-fit">Status</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choose Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dosage"
                  render={({ field }) => (
                    <FormItem className={formStyles.formItem}>
                      <FormLabel>Dosage</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem className={formStyles.formItem}>
                      <FormLabel className="w-fit">Unit</FormLabel>
                      <FormControl>
                        <Select
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Unit" />
                          </SelectTrigger>
                          <SelectContent>
                            {dosageUnits.map((unit) => (
                              <SelectItem key={unit} value={unit}>
                                {unit}
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
                  name="frequency"
                  render={({ field }) => (
                    <FormItem className={formStyles.formItem}>
                      <FormLabel className="w-fit">Frequency</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            {loading.frequency ? (
                              <div>Loading...</div>
                            ) : (
                              frequencyData.map((frequency) => (
                                <SelectItem key={frequency} value={frequency}>
                                  {frequency}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="intake_type"
                  render={({ field }) => (
                    <FormItem className={formStyles.formItem}>
                      <FormLabel className="w-fit">Intake type</FormLabel>
                      <FormControl>
                        <Select
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Unit" />
                          </SelectTrigger>
                          <SelectContent>
                            {loading.intake ? (
                              <div>Loading...</div>
                            ) : (
                              intakeTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="comments"
                  render={({ field }) => (
                    <FormItem className={formStyles.formItem}>
                      <FormLabel>Comments</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <SubmitButton
                  label={selectedSupplement ? "Update " : "Save"}
                  disabled={loading.post}
                />
              </div>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default SupplementsDialog;
