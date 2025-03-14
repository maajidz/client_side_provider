import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";
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
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { filterLabOrdersSchema } from "@/schema/createLabOrderSchema";
import { getLabOrdersData } from "@/services/chartsServices";
import { RootState } from "@/store/store";
import { LabOrdersDataInterface } from "@/types/chartsInterface";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { FetchProviderList } from "@/types/providerDetailsInterface";
import { useForm } from "react-hook-form";
import { columns } from "./columns";
import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { z } from "zod";
import { fetchProviderListDetails } from "@/services/registerServices";
import { UserData } from "@/types/userInterface";
import { fetchUserDataResponse } from "@/services/userServices";
import { labOrderStatus } from "@/constants/data";
import TableShimmer from "@/components/custom_buttons/shimmer/TableShimmer";
import { useToast } from "@/hooks/use-toast";
import { showToast } from "@/utils/utils";

function LabOrders() {
  // Provider Details
  const providerDetails = useSelector((state: RootState) => state.login);

  // Lab Orders State
  const [orderList, setOrderList] = useState<LabOrdersDataInterface>();

  // Patient List State
  const [patientData, setPatientData] = useState<UserData[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  // Provider List State
  const [providersList, setProvidersList] = useState<FetchProviderList[]>([]);

  // Search States
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [visibleSearchList, setVisibleSearchList] = useState<boolean>(false);

  // Loading States
  const [loading, setLoading] = useState<boolean>(false);
  const [dataLoading, setDataLoading] = useState<boolean>(false);

  // Pagination State
  const limit = 4;
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Filter State
  const [filters, setFilters] = useState({
    orderedby: "",
    status: "",
    name: "",
  });

  const router = useRouter();
  const { toast } = useToast();

  // Form Definition
  const form = useForm<z.infer<typeof filterLabOrdersSchema>>({
    resolver: zodResolver(filterLabOrdersSchema),
    defaultValues: {
      orderedby: "",
      status: "",
      name: "",
    },
  });

  // GET Patients Data
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
      const response = await fetchProviderListDetails({
        page: page,
        limit: 10,
      });
      setProvidersList(response.data);
    } catch (err) {
      console.error("Error fetching providers data:", err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  // Fetch Lab Orders Data
  const fetchLabOrdersList = useCallback(
    async (
      page: number,
      orderedBy?: string,
      userDetailsId?: string,
      status?: string
    ) => {
      try {
        setDataLoading(true);
        if (providerDetails) {
          const response = await getLabOrdersData({
            providerId: providerDetails.providerId,
            userDetailsId: userDetailsId || filters.name,
            orderedBy: orderedBy || filters.orderedby,
            status: status || filters.status,
            limit,
            page,
          });
          if (response) {
            setOrderList(response);
            setTotalPages(Math.ceil(response.total / limit));
          }
        }
      } catch (e) {
        console.log("Error", e);
        setOrderList(undefined);
      } finally {
        setDataLoading(false);
      }
    },
    [providerDetails, filters.name, filters.orderedby, filters.status]
  );

  // Patient useEffect
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim()) {
        fetchPatientData();
      } else {
        setPatientData([]);
        setSelectedUser(null);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchPatientData]);

  //Filter Patients
  const filteredPatients = patientData.filter((patient) =>
    `${patient.user.firstName} ${patient.user.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Lab Orders useEffect
  useEffect(() => {
    fetchLabOrdersList(page, filters.orderedby, filters.name, filters.status);
    fetchProvidersData();
  }, [page, fetchLabOrdersList, fetchProvidersData, filters]);

  //  Submit handler function
  function onSubmit(values: z.infer<typeof filterLabOrdersSchema>) {
    setFilters((prev) => ({
      ...prev,
      orderedby: values.orderedby === "all" ? "" : values.orderedby || "",
      status: values.status === "all" ? "" : values.status || "",
      name: values.name ? values.name : "",
    }));

    setPage(1);
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4"
        >
          <FormField
            control={form.control}
            name="orderedby"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ordered By</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Ordered By" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
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
                              key={provider.providerDetails.id}
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
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {labOrderStatus.map((status) => (
                        <SelectItem value={status.value} key={status.value}>
                          {status.label}
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
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
                        {selectedUser?.patientId}
                      </div>
                    </div>
                    {searchTerm && visibleSearchList && (
                      <div className="absolute bg-white border border-gray-300 mt-1 rounded shadow-lg z-[100] w-full">
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
      {dataLoading ? (
        <TableShimmer />
      ) : orderList?.data ? (
        <DefaultDataTable
          title={"Labs Order"}
          onAddClick={() => {
            router.push("/dashboard/provider/labs/create_lab_orders");
          }}
          columns={columns()}
          data={orderList?.data}
          pageNo={page}
          totalPages={totalPages}
          onPageChange={(newPage: number) => setPage(newPage)}
        />
      ) : (
        <div className="flex border rounded-md p-5 flex-row text-center h-32 w-full justify-between items-center">
          No Lab Orders Found
        </div>
      )}
    </div>
  );
}

export default LabOrders;
