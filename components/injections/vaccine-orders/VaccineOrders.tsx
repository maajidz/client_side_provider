import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";
import formStyles from "@/components/formStyles.module.css";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { addVaccineSchema } from "@/schema/injectionsAndVaccinesSchema";
import { createVaccineOrder } from "@/services/injectionsServices";
import { fetchProviderListDetails } from "@/services/registerServices";
import { fetchUserDataResponse } from "@/services/userServices";
import { FetchProviderList } from "@/types/providerDetailsInterface";
import { UserData } from "@/types/userInterface";
import { showToast } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

function VaccineOrders({
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

  // Data State
  const [patientData, setPatientData] = useState<UserData[]>([]);
  const [providersList, setProvidersList] = useState<FetchProviderList[]>([]);

  // Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleSearchList, setVisibleSearchList] = useState<boolean>(false);

  // Loading State
  const [loading, setLoading] = useState({ get: false, post: false });

  // Form State
  const form = useForm<z.infer<typeof addVaccineSchema>>({
    resolver: zodResolver(addVaccineSchema),
    defaultValues : {
      
    }
  });

  // Toast State
  const { toast } = useToast();

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
  const onSubmit = async (formData: z.infer<typeof addVaccineSchema>) => {
    setLoading((prev) => ({ ...prev, post: true }));

    const requestData = {
      ...formData,
      userDetailsId: userDetailsIdString ?? formData?.userDetailsId ?? "",
    };

    try {
      await createVaccineOrder({ requestData });

      showToast({
        toast,
        type: "success",
        message: "Vaccine order created successfully",
      });
    } catch (err) {
      if (err instanceof Error) {
        showToast({
          toast,
          type: "error",
          message: "Vaccine order creation failed",
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
      onClose();
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader>
          <DialogTitle>Add Vaccine Order</DialogTitle>
        </DialogHeader>
        <Form {...form}>
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
                name="vaccine_name"
                render={({ field }) => (
                  <FormItem className={formStyles.formItem}>
                    <FormLabel className="w-full">Vaccine</FormLabel>
                    <FormControl>
                      <Input
                        value={field.value}
                        placeholder="Search by vaccine name"
                        className="border rounded-md p-2 w-full text-gray-800"
                        onChange={field.onChange}
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
                    <FormLabel className="w-full">Ordered By</FormLabel>
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

              <DialogFooter>
                <div className="flex justify-end gap-2 w-fit">
                  <Button
                    variant="outline"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <SubmitButton label="Save" disabled={loading.post} />
                </div>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default VaccineOrders;
