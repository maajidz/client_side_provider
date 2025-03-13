import { getVaccinesData } from "@/services/injectionsServices";
import { VaccinesInterface } from "@/types/injectionsInterface";
import { columns } from "./column";
// import FilterVaccines from "./FilterVaccines";
import { useCallback, useEffect, useState } from "react";
import { vaccineSearchParams } from "@/schema/injectionsAndVaccinesSchema";
import { z } from "zod";
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";
import { showToast } from "@/utils/utils";
import { useToast } from "@/hooks/use-toast";
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
import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";
import { UserData } from "@/types/userInterface";
import { FetchProviderList } from "@/types/providerDetailsInterface";
import { fetchUserDataResponse } from "@/services/userServices";
import { fetchProviderListDetails } from "@/services/registerServices";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import VaccineOrders from "./VaccineOrders";
import TableShimmer from "@/components/custom_buttons/table/TableShimmer";
import { status } from "@/constants/data";

function VaccinesClient() {
  // Vaccine Dialog State
  const [isVaccineDialogOpen, setIsVaccineDialogOpen] =
    useState<boolean>(false);

  // Vaccines Data State
  const [vaccinesData, setVaccinesData] = useState<VaccinesInterface[]>([]);

  // Patient List State
  const [patientData, setPatientData] = useState<UserData[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  // Provider List State
  const [providersList, setProvidersList] = useState<FetchProviderList[]>([]);

  // Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleSearchList, setVisibleSearchList] = useState<boolean>(false);

  // Loading States
  const [loading, setLoading] = useState<boolean>(false);
  const [dataLoading, setDataLoading] = useState<boolean>(false);

  // Pagination States
  const itemsPerPage = 10;
  const [pageNo, setPageNo] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Filters State
  const [filters, setFilters] = useState({
    providerId: "",
    userDetailsId: "",
    status: "",
  });

  const { toast } = useToast();

  // Form Definition
  const form = useForm<z.infer<typeof vaccineSearchParams>>({
    resolver: zodResolver(vaccineSearchParams),
  });

  // Fetch Patient Data
  const fetchUserData = useCallback(async () => {
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
      showToast({
        toast,
        type: "error",
        message: "Could not fetch patients",
      });
      console.log("Error:", err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, toast]);

  // Fetch Provider Data
  const fetchProvidersData = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetchProviderListDetails({ page: 1, limit: 10 });

      setProvidersList(response.data);
    } catch (err) {
      showToast({
        toast,
        type: "error",
        message: "Could not fetch providers",
      });
      console.log("Error:", err);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // GET Vaccines Data
  const fetchVaccinesData = useCallback(
    async (
      page: number,
      userDetailsId?: string,
      providerId?: string,
      status?: string
    ) => {
      setDataLoading(true);
      try {
        const response = await getVaccinesData({
          userDetailsId: userDetailsId || filters.userDetailsId,
          providerId: providerId || filters.providerId,
          status: status || filters.status,
          page: page,
          limit: itemsPerPage,
        });

        if (response) {
          setVaccinesData(response.data);
          setTotalPages(Math.ceil(response.total / itemsPerPage));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setDataLoading(false);
      }
    },
    [filters.userDetailsId, filters.providerId, filters.status]
  );

  // Patient useEffect
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim()) {
        fetchUserData();
      } else {
        setPatientData([]);
        setSelectedUser(null);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchUserData]);

  // Filter Patients
  const filteredPatients = patientData.filter((patient) =>
    `${patient.user.firstName} ${patient.user.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Effects
  useEffect(() => {
    fetchVaccinesData(
      pageNo,
      filters.userDetailsId,
      filters.providerId,
      filters.status
    );
    fetchProvidersData();
  }, [
    fetchVaccinesData,
    fetchProvidersData,
    pageNo,
    filters.userDetailsId,
    filters.providerId,
    filters.status,
  ]);

  // Dialog Close Function
  const handleVaccineDialogClose = () => {
    setIsVaccineDialogOpen(false);
    fetchVaccinesData(1);
  };

  // Submit handler function
  function onSubmit(values: z.infer<typeof vaccineSearchParams>) {
    setFilters({
      providerId: values.providerId === "all" ? "" : values.providerId || "",
      userDetailsId:
        values.userDetailsId === "all" ? "" : values.userDetailsId || "",
      status: values.status === "all" ? "" : values.status || "",
    });
    setPageNo(1);
  }

  return (
    <div className="space-y-2">
      <div className="space-y-2">
        {/* Filter Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 w-full"
          >
            {/* Ordered By Filter */}
            <FormField
              control={form.control}
              name="providerId"
              render={({ field }) => (
                <FormItem className="flex items-center w-full">
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Filter by Ordered by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all" className="cursor-pointer">
                          All
                        </SelectItem>
                        {loading ? (
                          <div>Loading...</div>
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
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {/* Status Filter */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex items-center w-full">
                  <FormControl>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder="Filter by Status"
                          className="w-full"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all" className="cursor-pointer">
                          All
                        </SelectItem>
                        {status.map((status) => (
                          <SelectItem
                            key={status.value}
                            value={status.value}
                            className="cursor-pointer"
                          >
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {/* Patient Filter */}
            <FormField
              control={form.control}
              name="userDetailsId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <div className="relative w-full">
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
                          {selectedUser?.patientId}
                        </div>
                      </div>
                      {searchTerm && visibleSearchList && (
                        <div className="absolute bg-white border border-gray-300 mt-1 rounded shadow-lg w-full z-50">
                          {loading ? (
                            <div>Loading...</div>
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
                                  setSelectedUser(patient);
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
            <div className="flex items-end">
              <SubmitButton label="Search" />
            </div>
          </form>
        </Form>
      </div>
      {dataLoading ? (
        <TableShimmer />
      ) : (
        <DefaultDataTable
          title={"Vaccine Orders"}
          onAddClick={() => {
            setIsVaccineDialogOpen(true);
          }}
          columns={columns({
            setLoading,
            showToast: () =>
              showToast({
                toast,
                type: "success",
                message: "Deleted Successfully",
              }),
            fetchVaccinesData: () => fetchVaccinesData(1),
          })}
          data={vaccinesData}
          pageNo={pageNo}
          totalPages={totalPages}
          onPageChange={(newPage) => setPageNo(newPage)}
        />
      )}
      <VaccineOrders
        isOpen={isVaccineDialogOpen}
        onClose={handleVaccineDialogClose}
      />
    </div>
  );
}

export default VaccinesClient;
