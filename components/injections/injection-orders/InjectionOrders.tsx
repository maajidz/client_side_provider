import DefaultButton from "@/components/custom_buttons/buttons/DefaultButton";
import SubmitButton from "@/components/custom_buttons/SubmitButton";
import formStyles from "@/components/formStyles.module.css";
import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { createInjectionOrder } from "@/services/injectionsServices";
import { fetchProviderListDetails } from "@/services/registerServices";
import { fetchUserDataResponse } from "@/services/userServices";
import { CreateInjectionType } from "@/types/injectionsInterface";
import { FetchProviderList } from "@/types/providerDetailsInterface";
import { UserData } from "@/types/userInterface";
import { showToast } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

function InjectionOrders() {
  // To toggle patient input
  const params = useParams();
  const { userDetailsId } = params;

  // Data State
  const [patientData, setPatientData] = useState<UserData[]>([]);
  const [providersList, setProvidersList] = useState<FetchProviderList[]>([]);

  // Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleSearchList, setVisibleSearchList] = useState<boolean>(false);

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Loading State
  const [loading, setLoading] = useState({ get: false, post: false });

  // Form State
  const form = useForm<z.infer<typeof addInjectionSchema>>({
    resolver: zodResolver(addInjectionSchema),
  });

  // Toast State
  const { toast } = useToast();

  // Handle Dialog State
  const handleIsDialogOpen = (status: boolean) => {
    setIsDialogOpen(status);
    form.reset();
  };

  // Fetch User Data
  const fetchUserData = useCallback(async () => {
    setLoading((prev) => ({ ...prev, get: true }));

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
      setLoading((prev) => ({ ...prev, get: false }));
    }
  }, [searchTerm, toast]);

  // Fetch Providers Data
  const fetchProvidersData = useCallback(async () => {
    setLoading((prev) => ({ ...prev, get: true }));

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
      setLoading((prev) => ({ ...prev, get: false }));
    }
  }, [toast]);

  // POST Injection
  const onSubmit = async (formData: z.infer<typeof addInjectionSchema>) => {
    setLoading((prev) => ({ ...prev, post: true }));

    const finalData: CreateInjectionType = {
      ...formData,
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
      setIsDialogOpen(false);
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

    fetchProvidersData();
  }, [fetchUserData, fetchProvidersData, userDetailsId]);

  const filteredPatients = patientData.filter((patient) =>
    `${patient.user.firstName} ${patient.user.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleIsDialogOpen}>
      <DialogTrigger asChild>
        <DefaultButton>
          <PlusIcon />
          <div>Injection Order</div>
        </DefaultButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader>
          <DialogTitle>Add Injection Order</DialogTitle>
        </DialogHeader>
        {loading.get ? (
          <LoadingButton />
        ) : (
          <Form {...form}>
            <ScrollArea className="h-[30rem]">
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className={formStyles.formBody}>
                  {!userDetailsId && <FormField
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
                  />}
                  <FormField
                    control={form.control}
                    name="injection_name"
                    render={({ field }) => (
                      <FormItem className={formStyles.formItem}>
                        <FormLabel>Injection</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter injection to add"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="providerId"
                    render={({ field }) => (
                      <FormItem className={formStyles.formItem}>
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
                  <div className={formStyles.formItem}>
                    <div>Dosage</div>
                    <div className="flex gap-3">
                      <FormField
                        control={form.control}
                        name="dosage.dosage_quantity"
                        render={({ field }) => (
                          <FormItem className={formStyles.formItem}>
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
                                  <SelectItem value="mg">mg</SelectItem>
                                  <SelectItem value="unit2">Unit 2</SelectItem>
                                  <SelectItem value="unit3">Unit 3</SelectItem>
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
                      <FormItem className={formStyles.formItem}>
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
                              <SelectItem value="frequency1">
                                Frequency 1
                              </SelectItem>
                              <SelectItem value="frequency2">
                                Frequency 2
                              </SelectItem>
                              <SelectItem value="frequency3">
                                Frequency 3
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  <div className={formStyles.formItem}>
                    <div>Period</div>
                    <div className="flex gap-3">
                      <FormField
                        control={form.control}
                        name="period.period_number"
                        render={({ field }) => (
                          <FormItem className={formStyles.formItem}>
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
                                  <SelectItem value="months">
                                    Month(s)
                                  </SelectItem>
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
                      <FormItem className={formStyles.formItem}>
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
                      <FormItem className={formStyles.formItem}>
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
                      <FormItem className={formStyles.formItem}>
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
                      <Button
                        variant="outline"
                        onClick={() => handleIsDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <SubmitButton label="Save" disabled={loading.post} />
                    </div>
                  </DialogFooter>
                </div>
              </form>
            </ScrollArea>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default InjectionOrders;
