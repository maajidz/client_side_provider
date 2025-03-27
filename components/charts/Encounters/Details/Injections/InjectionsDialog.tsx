import React, { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createInjectionSchema } from "@/schema/createInjections";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CreateInjectionInterface,
  InjectionsData,
  InjectionsType,
  UpdateInjectionInterface,
} from "@/types/injectionsInterface";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  createInjection,
  getInjectionsType,
  updateInjection,
} from "@/services/injectionsServices";
import { showToast } from "@/utils/utils";
import { useToast } from "@/hooks/use-toast";
import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";
import formStyles from "@/components/formStyles.module.css";
import {
  getDosageUnits,
  getFrequencyData,
  getInjectionSite,
  getParenteralRoutes,
} from "@/services/enumServices";

const InjectionsDialog = ({
  userDetailsId,
  injectionsData,
  onClose,
  isOpen,
}: {
  userDetailsId: string;
  injectionsData?: InjectionsData | null;
  onClose: () => void;
  isOpen: boolean;
}) => {
  const providerDetails = useSelector((state: RootState) => state.login);

  // Injections Type
  const [injectionsType, setInjectionsType] = useState<InjectionsType[]>([]);

  const [loading, setLoading] = React.useState({
    post: false,
    type: false,
    dosage: false,
    frequency: false,
    parenteralRoutes: false,
    injectionSite: false,
  });
  const { toast } = useToast();

  // Search Types
  const [searchType, setSearchType] = useState<string>("");
  const [visibleTypeList, setVisibleTypeList] = useState<boolean>(false);

  // Frequency Data
  const [frequencyData, setFrequencyData] = useState<string[]>([]);

  // Dosage Units
  const [dosageUnits, setDosageUnits] = useState<string[]>([]);

  // Parenteral Routes
  const [parenteralRoutes, setParenteralRoutes] = useState<string[]>([]);

  // Injection Site
  const [injectionSite, setInjectionSite] = useState<string[]>([]);

  const form = useForm<z.infer<typeof createInjectionSchema>>({
    resolver: zodResolver(createInjectionSchema),
    defaultValues: {
      injection_type_Id: injectionsData?.injectionType.id || "",
      dosage_unit: injectionsData?.dosage_unit || "",
      dosage_quantity: injectionsData?.dosage_quantity || 0,
      frequency: injectionsData?.frequency || "",
      period_number: injectionsData?.period_number || 0,
      period_unit: injectionsData?.period_unit || "",
      parental_route: injectionsData?.parental_route || "",
      site: injectionsData?.site || "",
      lot_number: injectionsData?.lot_number || 0,
      expiration_date: injectionsData?.expiration_date || "",
      administered_date: injectionsData?.administered_date || "",
      administered_time: injectionsData?.administered_time || "",
      note_to_nurse: injectionsData?.note_to_nurse || "",
      comments: injectionsData?.comments || "",
    },
  });

  const routeName = form.watch("parental_route");

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

  // Fetch Parenteral Routes
  const fetchParenteralRoutes = useCallback(async () => {
    try {
      setLoading((prev) => ({ ...prev, parenteralRoutes: true }));
      const types = await getParenteralRoutes();

      if (types) {
        setParenteralRoutes(types);
      }
    } catch (err) {
      console.log("An error occurred", err);
    } finally {
      setLoading((prev) => ({ ...prev, parenteralRoutes: false }));
    }
  }, []);

  // Fetch Injection Site
  const fetchInjectionSite = useCallback(
    async ({ route }: { route: string }) => {
      try {
        setLoading((prev) => ({ ...prev, injectionSite: true }));
        const types = await getInjectionSite({ route });

        if (types) {
          setInjectionSite(types);
        }
      } catch (err) {
        console.log("An error occurred", err);
      } finally {
        setLoading((prev) => ({ ...prev, injectionSite: false }));
      }
    },
    []
  );

  useEffect(() => {
    if (routeName) {
      fetchInjectionSite({ route: routeName });
    }
  }, [routeName, fetchInjectionSite]);

  useEffect(() => {
    if (injectionsData) {
      form.reset({
        injection_type_Id: injectionsData.injectionType.id || "",
        dosage_unit: injectionsData.dosage_unit || "",
        dosage_quantity: injectionsData.dosage_quantity || 0,
        frequency: injectionsData.frequency || "",
        period_number: injectionsData.period_number || 0,
        period_unit: injectionsData.period_unit || "",
        parental_route: injectionsData.parental_route || "",
        site: injectionsData.site || "",
        lot_number: injectionsData.lot_number || 0,
        expiration_date: injectionsData.expiration_date || "",
        administered_date: injectionsData.administered_date || "",
        administered_time: injectionsData.administered_time || "",
        note_to_nurse: injectionsData.note_to_nurse || "",
        comments: injectionsData.comments || "",
      });
      setSearchType(injectionsData?.injectionType.injection_name);
    } else {
      form.reset({
        injection_type_Id: "",
        dosage_unit: "",
        dosage_quantity: 0,
        frequency: "",
        period_number: 0,
        period_unit: "",
        parental_route: "",
        site: "",
        lot_number: 0,
        expiration_date: "",
        administered_date: "",
        administered_time: "",
        note_to_nurse: "",
        comments: "",
      });
      setSearchType("");
    }
  }, [form, injectionsData]);

  useEffect(() => {
    fetchInjectionsType();
    fetchFrequency();
    fetchDosageUnits();
    fetchParenteralRoutes();
  }, [
    fetchInjectionsType,
    fetchDosageUnits,
    fetchFrequency,
    fetchParenteralRoutes,
  ]);

  const filteredInjectionTypes = injectionsType.filter((type) =>
    type.injection_name.toLowerCase().includes(searchType.toLowerCase())
  );

  const onSubmit = async (values: z.infer<typeof createInjectionSchema>) => {
    console.log(values);
    try {
      setLoading((prev) => ({ ...prev, post: true }));

      if (injectionsData) {
        const requestBody: UpdateInjectionInterface = {
          ...values,
          status: "pending",
        };
        const response = await updateInjection({
          requestBody: requestBody,
          id: injectionsData.id,
        });
        if (response) {
          showToast({
            toast,
            type: "success",
            message: "Injection updated successfully",
          });
        }
      } else {
        const requestBody: CreateInjectionInterface = {
          ...values,
          status: "pending",
          userDetailsId,
          providerId: providerDetails.providerId,
        };
        const response = await createInjection({ requestBody: requestBody });
        if (response) {
          showToast({
            toast,
            type: "success",
            message: "Injection added successfully",
          });
        }
      }
    } catch (error) {
      console.log(error);
      showToast({
        toast,
        type: "error",
        message: " Error while adding Injection",
      });
    } finally {
      setLoading((prev) => ({ ...prev, post: false }));
      form.reset();
      setSearchType("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle asChild>
            {injectionsData ? "Edit Injections" : "Add Injections"}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[80dvh]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6 p-2.5">
                <FormField
                  control={form.control}
                  name="injection_type_Id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
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
                            disabled={injectionsData ? true : false}
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div>
                  <div className="flex gap-3 items-end">
                    <FormField
                      control={form.control}
                      name="dosage_quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dosage</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
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
                      name="dosage_unit"
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
                      <FormLabel>Frequency</FormLabel>
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
                      name="period_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Period</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
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
                      name="period_unit"
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
                      <FormLabel>Parental Route</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Parenteral Route" />
                          </SelectTrigger>
                          <SelectContent>
                            {loading.parenteralRoutes ? (
                              <div>Loading...</div>
                            ) : (
                              parenteralRoutes.map((route, index) => (
                                <SelectItem value={route} key={index}>
                                  {route}
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
                <FormField
                  control={form.control}
                  name="site"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Site" />
                          </SelectTrigger>
                          <SelectContent>
                            {loading.injectionSite ? (
                              <div>Loading...</div>
                            ) : (
                              injectionSite.map((site, index) => (
                                <SelectItem value={site} key={index}>
                                  {site}
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
                <FormField
                  control={form.control}
                  name="lot_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lot number</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expiration_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiration Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} className="w-fit" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-3">
                  <FormField
                    control={form.control}
                    name="administered_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Administered Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="administered_time"
                    render={({ field }) => (
                      <FormItem className={`${formStyles.formItem} w-full`}>
                        <FormLabel>Administered Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="note_to_nurse"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Note to nurse</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="comments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comments</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <SubmitButton label="Submit" disabled={loading.post} />
              </div>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default InjectionsDialog;
