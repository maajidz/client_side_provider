import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";
import formStyles from "@/components/formStyles.module.css";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { useToast } from "@/hooks/use-toast";
import { addInjectionSchema } from "@/schema/injectionsAndVaccinesSchema";
import { getDosageUnits, getFrequencyData } from "@/services/enumServices";
import {
  createInjectionOrder,
  getInjectionsType,
} from "@/services/injectionsServices";
import { fetchProviderListDetails } from "@/services/registerServices";
import { fetchUserDataResponse } from "@/services/userServices";
import {
  CreateInjectionType,
  InjectionsType,
} from "@/types/injectionsInterface";
import { FetchProviderList } from "@/types/providerDetailsInterface";
import { UserData } from "@/types/userInterface";
import { showToast } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

function InjectionOrders({
  onClose,
  isOpen,
}: {
  onClose: () => void;
  isOpen: boolean;
}) {
  // To toggle patient input
  const params = useParams();
  const { userDetailsId } = params;
  const userDetailsIdString = Array.isArray(userDetailsId)
    ? userDetailsId[0]
    : userDetailsId;

  // Injections Type
  const [injectionsType, setInjectionsType] = useState<InjectionsType[]>([]);

  // Frequency Data
  const [frequencyData, setFrequencyData] = useState<string[]>([]);

  // Dosage Units
  const [dosageUnits, setDosageUnits] = useState<string[]>([]);

  // Data State
  const [patientData, setPatientData] = useState<UserData[]>([]);
  const [providersList, setProvidersList] = useState<FetchProviderList[]>([]);

  // Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleSearchList, setVisibleSearchList] = useState<boolean>(false);

  // Search Types
  const [searchType, setSearchType] = useState("");
  const [visibleTypeList, setVisibleTypeList] = useState(false);

  // Loading State
  const [loading, setLoading] = useState({
    patient: false,
    provider: false,
    post: false,
    type: false,
    frequency: false,
    dosage: false,
  });

  // Form State
  const form = useForm<z.infer<typeof addInjectionSchema>>({
    resolver: zodResolver(addInjectionSchema),
  });

  // Toast State
  const { toast } = useToast();

  // Fetch User Data
  const fetchUserData = useCallback(async () => {
    setLoading((prev) => ({ ...prev, patient: true }));

    try {
      const response = await fetchUserDataResponse({
        pageNo: 1,
        pageSize: 10,
        firstName: searchTerm,
        lastName: searchTerm,
      });

      if (response) {
        setPatientData(response.data);
      } else {
        throw new Error();
      }
    } catch (err) {
      if (err instanceof Error) {
        showToast({
          toast,
          type: "error",
          message: "Could not fetch patients",
        });
      } else {
        showToast({
          toast,
          type: "error",
          message: "An unknown error occurred",
        });
      }
    } finally {
      setLoading((prev) => ({ ...prev, patient: false }));
    }
  }, [searchTerm, toast]);

  // Fetch Injections Type
  const fetchInjectionsType = useCallback(async () => {
    setLoading((prev) => ({ ...prev, type: true }));

    const response = await getInjectionsType({ search: searchType });

    if (response) {
      setInjectionsType(response.data);
    }
    try {
    } catch (err) {
      if (err instanceof Error) {
        showToast({
          toast,
          type: "error",
          message: "Could not fetch injection types",
        });
      } else {
        showToast({
          toast,
          type: "error",
          message: "An unknown error occurred",
        });
      }
    } finally {
      setLoading((prev) => ({ ...prev, type: false }));
    }
  }, [searchType, toast]);

  // Fetch Providers Data
  const fetchProvidersData = useCallback(async () => {
    setLoading((prev) => ({ ...prev, provider: true }));

    try {
      const response = await fetchProviderListDetails({ page: 1, limit: 10 });

      setProvidersList(response.data);
    } catch (err) {
      if (err instanceof Error) {
        showToast({
          toast,
          type: "error",
          message: "Could not fetch providers",
        });
      } else {
        showToast({
          toast,
          type: "error",
          message: "An unknown error occurred",
        });
      }
    } finally {
      setLoading((prev) => ({ ...prev, provider: false }));
    }
  }, [toast]);

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

  useEffect(() => {
    if (userDetailsIdString) {
      form.setValue("userDetailsId", userDetailsIdString);
    }
  }, [userDetailsIdString, form]);

  // POST Injection
  const onSubmit = async (formData: z.infer<typeof addInjectionSchema>) => {
    setLoading((prev) => ({ ...prev, post: true }));

    const finalData: CreateInjectionType = {
      ...formData,
      userDetailsId: userDetailsIdString ?? formData?.userDetailsId ?? "",
      dosage_quantity: formData.dosage.dosage_quantity,
      dosage_unit: formData.dosage.dosage_unit,
      period_number: formData.period.period_number,
      period_unit: formData.period.period_unit,
    };

    try {
      await createInjectionOrder({ requestBody: finalData });

      showToast({
        toast,
        type: "success",
        message: "Injection order created successfully",
      });
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        showToast({
          toast,
          type: "error",
          message: "Injection order creation failed",
        });
      } else {
        showToast({
          toast,
          type: "error",
          message: "An unknown error occurred",
        });
      }
    } finally {
      setLoading((prev) => ({ ...prev, post: false }));
      form.reset();
    }
  };

  // Effects
  useEffect(() => {
    if (!userDetailsId) {
      fetchUserData();
    }

    fetchInjectionsType();
    fetchProvidersData();
    fetchFrequency();
    fetchDosageUnits();
  }, [
    fetchFrequency,
    fetchUserData,
    fetchInjectionsType,
    fetchProvidersData,
    fetchDosageUnits,
    userDetailsId,
  ]);

  const filteredPatients = patientData.filter((patient) =>
    `${patient.user.firstName} ${patient.user.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const filteredInjectionTypes = injectionsType.filter((type) =>
    type.injection_name.toLowerCase().includes(searchType.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader>
          <DialogTitle>Add Injection Order</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <ScrollArea className="h-max-[80dvh] h-auto">
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className={formStyles.formBody}>
                {!userDetailsId && (
                  <FormField
                    control={form.control}
                    name="userDetailsId"
                    render={({ field }) => (
                      <FormItem className={formStyles.formItem}>
                        <FormLabel>Patient</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Search Patient "
                              value={searchTerm}
                              onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setVisibleSearchList(true);
                              }}
                            />
                            {searchTerm && visibleSearchList && (
                              <div className="absolute bg-white border border-gray-300 mt-1 rounded shadow-lg  w-full">
                                {filteredPatients.length > 0 ? (
                                  filteredPatients.map((patient) => (
                                    <div
                                      key={patient.id}
                                      className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                      onClick={() => {
                                        field.onChange(patient.id);
                                        setSearchTerm(
                                          `${patient.user.firstName} ${patient.user.lastName}`
                                        );
                                        setVisibleSearchList(false);
                                      }}
                                    >
                                      {`${patient.user.firstName} ${patient.user.lastName}`}
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
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="injection_name"
                  render={({ field }) => (
                    <FormItem className={formStyles.formItem}>
                      <FormLabel className="w-full">Injection</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            value={searchType}
                            placeholder="Search by name or code"
                            className="w-full"
                            onChange={(e) => {
                              setSearchType(e.target.value);
                              setVisibleTypeList(true);
                            }}
                          />
                          {searchType && visibleTypeList && (
                            <div className="absolute bg-white border border-gray-200 text-sm font-medium mt-1 rounded shadow-md w-full">
                              {loading.type ? (
                                <div>Loading...</div>
                              ) : filteredInjectionTypes.length > 0 ? (
                                filteredInjectionTypes.map((type) => (
                                  <div
                                    key={type.id}
                                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                    onClick={() => {
                                      field.onChange(type.id);
                                      setSearchType(type.injection_name);
                                      setVisibleTypeList(false);
                                    }}
                                  >
                                    {type.injection_name}
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
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="providerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ordered By</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Ordered by" />
                          </SelectTrigger>
                          <SelectContent>
                            {providersList
                              .filter(
                                (
                                  provider
                                ): provider is typeof provider & {
                                  providerDetails: { id: string };
                                } => Boolean(provider?.providerDetails?.id)
                              )
                              .map((provider) => (
                                <SelectItem
                                  key={provider.id}
                                  value={provider.providerDetails.id}
                                  className="cursor-pointer"
                                >
                                  {provider.firstName} {provider.lastName}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <div>
                  <div className="flex gap-3 items-end">
                    <FormField
                      control={form.control}
                      name="dosage.dosage_quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dosage</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              placeholder="Enter Quantity"
                              onChange={(e) =>
                                field.onChange(e.target.valueAsNumber)
                              }
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dosage.dosage_unit"
                      render={({ field }) => (
                        <FormItem className={`${formStyles.formItem} w-full`}>
                          <FormControl>
                            <Select
                              value={field.value}
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
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="w-full">Frequency</FormLabel>
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
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <div>
                  <div className="flex gap-3 items-end">
                    <FormField
                      control={form.control}
                      name="period.period_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="w-full">Period</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              placeholder="Enter Quantity"
                              onChange={(e) =>
                                field.onChange(e.target.valueAsNumber)
                              }
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="period.period_unit"
                      render={({ field }) => (
                        <FormItem className={`${formStyles.formItem} w-full`}>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Unit" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Days">Day(s)</SelectItem>
                                <SelectItem value="Weeks">Week(s)</SelectItem>
                                <SelectItem value="months">Month(s)</SelectItem>
                                <SelectItem value="years">Year(s)</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="parental_route"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="w-full">Parental Route</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Parental Route" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="parentalRoute1">
                              Parental Route 1
                            </SelectItem>
                            <SelectItem value="parentalRoute2">
                              Parental Route 2
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="note_to_nurse"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="w-full">Note to Nurse</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="border rounded-md p-2 w-full text-gray-800"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="comments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="w-full">Comments</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="border rounded-md p-2 w-full text-gray-800"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <div className="flex justify-end gap-2 w-fit">
                    <Button variant="outline" onClick={onClose}>
                      Cancel
                    </Button>
                    <SubmitButton label="Save" disabled={loading.post} />
                  </div>
                </DialogFooter>
              </div>
            </form>
          </ScrollArea>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default InjectionOrders;
