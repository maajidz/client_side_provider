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
import LoadingButton from "@/components/LoadingButton";
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";
import { useRouter } from "next/navigation";
import { fetchProviderListDetails } from "@/services/registerServices";
import { FetchProviderListInterface } from "@/types/providerDetailsInterface";
import { UserData } from "@/types/userInterface";
import { fetchUserDataResponse } from "@/services/userServices";

function ImageOrders() {
  const providerDetails = useSelector((state: RootState) => state.login);
  const [providerListData, setProviderListData] =
    useState<FetchProviderListInterface>({
      data: [],
      total: 0,
    });
  const [orderList, setOrderList] = useState<ImageOrdersResponseInterface>();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Patient State
  const [patientData, setPatientData] = useState<UserData[]>([]);

  // Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleSearchList, setVisibleSearchList] = useState<boolean>(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof filterLabOrdersSchema>>({
    resolver: zodResolver(filterLabOrdersSchema),
    defaultValues: {
      orderedby: "",
      status: "",
      name: "",
    },
  });

  const filters = form.watch();

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

  // GET Patients' Data
  const fetchPatientData = useCallback(async (currentPage: number) => {
    setLoading(true);
    try {
      const response = await fetchUserDataResponse({ pageNo: currentPage });
      if (response) {
        setPatientData(response.data);
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchImageOrdersList = useCallback(
    async (page: number) => {
      try {
        setLoading(true);
        const limit = 4;
        if (providerDetails) {
          const response = await getImagesOrdersData({
            providerId: filters.orderedby === "all" ? "" : filters.orderedby,
            userDetailsId: filters.name,
            limit: limit,
            page: page,
          });
          if (response) {
            setOrderList(response);
            setTotalPages(Math.ceil(response.total / limit));
          }
        }
        setLoading(false);
      } catch (e) {
        console.log("Error", e);
      } finally {
        setLoading(false);
      }
    },
    [providerDetails, filters.orderedby, filters.name]
  );

  useEffect(() => {
    fetchImageOrdersList(page);
    fetchPatientData(page);
    fetchProvidersList();
  }, [page, fetchImageOrdersList, fetchPatientData, fetchProvidersList]);

  const filteredPatients = patientData.filter((patient) =>
    `${patient.user.firstName} ${patient.user.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingButton />;
  }

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
                      {providerListData.data.map((providerList) => {
                        const providerId =
                          providerList.providerDetails?.id ?? providerList.id;
                        return (
                          <SelectItem
                            key={providerList.id}
                            value={providerId}
                          >{`${providerList.firstName} ${providerList.lastName}`}</SelectItem>
                        );
                      })}
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
                      <SelectItem value="signed">Signed</SelectItem>
                      <SelectItem value="unsigned">Unsigned</SelectItem>
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
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      {orderList?.data && (
        <DefaultDataTable
          title={"Image Orders"}
          onAddClick={() => {
            router.push("/dashboard/provider/images/create_image_orders");
          }}
          columns={columns()}
          data={orderList?.data}
          pageNo={page}
          totalPages={totalPages}
          onPageChange={(newPage: number) => setPage(newPage)}
        />
      )}
    </div>
  );
}

export default ImageOrders;
