import {
  Form,
  FormControl,
  FormField,
  FormItem,
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
import { filterPrescriptionSchema } from "@/schema/prescriptionSchema";
import { fetchProviderListDetails } from "@/services/registerServices";
import { fetchUserDataResponse } from "@/services/userServices";
import { FetchProviderList } from "@/types/providerDetailsInterface";
import { UserData } from "@/types/userInterface";
import { showToast } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface FilterPrescriptions {
  onSelectProvider: (id: string | null) => void;
  onSelectUser: (id: string | null) => void;
}

function FilterPrescriptions({
  onSelectProvider,
  onSelectUser,
}: FilterPrescriptions) {
  // Patients Data State
  const [patientData, setPatientData] = useState<UserData[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<UserData | null>(null);

  // Providers List State
  const [providersList, setProvidersList] = useState<FetchProviderList[]>([]);

  // Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleSearchList, setVisibleSearchList] = useState(false);

  // Loading State
  const [loading, setLoading] = useState(false);

  // Toast State
  const { toast } = useToast();

  // Form State
  const form = useForm<z.infer<typeof filterPrescriptionSchema>>({
    resolver: zodResolver(filterPrescriptionSchema),
    defaultValues: {
      patient: "",
      provider: "",
    },
  });

  // Get Patients Data
  const fetchPatientData = useCallback(async () => {
    setLoading(true);

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
      setLoading(false);
    }
  }, [searchTerm, toast]);

  // Fetch Providers Data
  const fetchProvidersData = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetchProviderListDetails({ page: 1, limit: 15 });
      setProvidersList(response.data);
    } catch (err) {
      console.error("Error fetching providers data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Patient useEffect
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim()) {
        fetchPatientData();
      } else {
        setPatientData([]);
        setSelectedPatient(null);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchPatientData]);

  // Effects
  useEffect(() => {
    fetchProvidersData();
  }, [fetchProvidersData]);

  // Filter Patients
  const filteredPatients = patientData.filter((patient) =>
    `${patient.user.firstName} ${patient.user.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {/* Patient Filter */}
          <FormField
            control={form.control}
            name="patient"
            render={() => (
              <div>
                <FormItem>
                  {/* Patient Filter */}
                  <FormField
                    control={form.control}
                    name="patient"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <div className="flex gap-2 border pr-2 rounded-md items-baseline">
                              <Input
                                placeholder="Search Patient "
                                value={searchTerm}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  setSearchTerm(value);
                                  setVisibleSearchList(true);

                                  if (!value) {
                                    field.onChange("");
                                  }
                                }}
                                className="border-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 "
                              />
                              <div className="px-3 py-1 text-base">
                                {" "}
                                {selectedPatient?.patientId}
                              </div>
                            </div>
                            {searchTerm && visibleSearchList && (
                              <div className="absolute bg-white border border-gray-300 mt-1 rounded shadow-lg w-full z-[100]">
                                {loading ? (
                                  <div>Loading... </div>
                                ) : filteredPatients.length > 0 ? (
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
                                        setSelectedPatient(patient);
                                        onSelectUser(patient.id);
                                      }}
                                    >
                                      {`${patient.user.firstName} ${patient.user.lastName} - ${patient.patientId}`}
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
                </FormItem>
              </div>
            )}
          />

          {/* Provider Filter */}
          <FormField
            control={form.control}
            name="provider"
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                  onSelectProvider(value === "all" ? null : value);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by Provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="cursor-pointer">
                    All
                  </SelectItem>
                  {loading ? (
                    <div>Loading... </div>
                  ) : (
                    providersList
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
                      ))
                  )}
                </SelectContent>
              </Select>
            )}
          />
        </form>
      </Form>
    </div>
  );
}

export default FilterPrescriptions;
