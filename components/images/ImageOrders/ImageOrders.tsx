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
import { getImagesOrdersData } from "@/services/chartsServices";
import { RootState } from "@/store/store";
import { ImageOrdersResponseInterface } from "@/types/chartsInterface";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";
import { columns } from "./columns";
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";
import { useRouter } from "next/navigation";
import { fetchProviderListDetails } from "@/services/registerServices";
import { FetchProviderListInterface } from "@/types/providerDetailsInterface";
import { UserData } from "@/types/userInterface";
import { fetchUserDataResponse } from "@/services/userServices";
import TableShimmer from "@/components/custom_buttons/shimmer/TableShimmer";
import { imagesStatus } from "@/constants/data";
import { useToast } from "@/hooks/use-toast";
import { showToast } from "@/utils/utils";

function ImageOrders() {
  // Provider Details
  const providerDetails = useSelector((state: RootState) => state.login);

  // Image Orders State
  const [orderList, setOrderList] = useState<ImageOrdersResponseInterface>();

  // Patient State
  const [patientData, setPatientData] = useState<UserData[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  // Provider List State
  const [providerListData, setProviderListData] =
    useState<FetchProviderListInterface>({
      data: [],
      total: 0,
    });

  // Search State
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [visibleSearchList, setVisibleSearchList] = useState<boolean>(false);

  // Loading States
  const [loading, setLoading] = useState<boolean>(false);
  const [dataLoading, setDataLoading] = useState<boolean>(false);

  // Pagination State
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

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

  const filters = form.watch();

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

  // GET Providers List
  const fetchProvidersList = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchProviderListDetails({ page: 1, limit: 10 });
      if (data) {
        setProviderListData(() => ({
          data: data.data,
          total: data.total,
        }));
      }
    } catch (e) {
      console.log("Error", e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch Image Orders Data
  const fetchImageOrdersList = useCallback(
    async (page: number) => {
      try {
        setDataLoading(true);
        const limit = 4;
        if (providerDetails) {
          const response = await getImagesOrdersData({
            providerId:
              filters.orderedby === "all"
                ? ""
                : filters.orderedby
                ? filters.orderedby
                : providerDetails.providerId,
            userDetailsId: filters.name,
            status: filters.status,
            limit,
            page,
          });
          if (response) {
            setOrderList(response);
            setTotalPages(Math.ceil(response.total / limit));
          }
        }
        setDataLoading(false);
      } catch (e) {
        console.log("Error", e);
      } finally {
        setDataLoading(false);
      }
    },
    [providerDetails, filters.orderedby, filters.name, filters.status]
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

  // Filter Patients
  const filteredPatients = patientData.filter((patient) =>
    `${patient.user.firstName} ${patient.user.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchImageOrdersList(page);
    fetchProvidersList();
  }, [page, fetchImageOrdersList, fetchProvidersList]);

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
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
                        providerListData.data.map((providerList) => {
                          const providerId =
                            providerList.providerDetails?.id ?? providerList.id;
                          return (
                            <SelectItem
                              key={providerList.id}
                              value={providerId}
                            >{`${providerList.firstName} ${providerList.lastName}`}</SelectItem>
                          );
                        })
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
                      {imagesStatus.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
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
        </form>
      </Form>
      {dataLoading ? (
        <TableShimmer />
      ) : (
        <DefaultDataTable
          title={"Image Orders"}
          onAddClick={() => {
            router.push("/dashboard/provider/images/create_image_orders");
          }}
          columns={columns()}
          data={orderList?.data || []}
          pageNo={page}
          totalPages={totalPages}
          onPageChange={(newPage: number) => setPage(newPage)}
        />
      )}
    </div>
  );
}

export default ImageOrders;
