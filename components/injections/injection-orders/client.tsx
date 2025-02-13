import LoadingButton from "@/components/LoadingButton";
import { getInjectionsData } from "@/services/injectionsServices";
import { InjectionsInterface } from "@/types/injectionsInterface";
import { columns } from "./column";
// import FilterInjections from "./FilterInjections";
import { useCallback, useEffect, useState } from "react";
import { injectionsSearchParams } from "@/schema/injectionsAndVaccinesSchema";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { showToast } from "@/utils/utils";
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FetchProviderList } from "@/types/providerDetailsInterface";
import { UserData } from "@/types/userInterface";
import { fetchUserDataResponse } from "@/services/userServices";
import { fetchProviderListDetails } from "@/services/registerServices";

function InjectionsClient({ refreshTrigger }: { refreshTrigger: number }) {
  const [injectionsData, setInjectionsData] = useState<InjectionsInterface[]>(
    []
  );
  const [providersList, setProvidersList] = useState<FetchProviderList[]>([]);
  const [patientData, setPatientData] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [visibleSearchList, setVisibleSearchList] = useState<boolean>(false);
  const [pageNo, setPageNo] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    providerId: "",
    userDetailsId: "",
    status: "",
  });

  const form = useForm<z.infer<typeof injectionsSearchParams>>({
    resolver: zodResolver(injectionsSearchParams),
    defaultValues: {
      providerId: "",
      userDetailsId: "",
      status: "",
    },
  });

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
      console.log("Error", err);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // GET Injections Data
  const fetchInjectionsData = useCallback(
    async (
      page: number,
      status?: string,
      providerId?: string,
      userDetailsId?: string
    ) => {
      setLoading(true);

      try {
        const response = await getInjectionsData({
          providerId: providerId || filters.providerId,
          userDetailsId: userDetailsId || filters.userDetailsId,
          status: status || filters.status,
          page: page,
          limit: itemsPerPage,
        });

        if (response) {
          setInjectionsData(response.data);
          setTotalPages(Math.ceil(response.total / itemsPerPage));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [filters.userDetailsId, filters.providerId, filters.status]
  );

  const filteredPatients = patientData.filter((patient) =>
    `${patient.user.firstName} ${patient.user.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchUserData();
    fetchProvidersData();
  }, [fetchUserData, fetchProvidersData]);

  // Effects
  useEffect(() => {
    fetchInjectionsData(
      pageNo,
      filters.status,
      filters.providerId,
      filters.userDetailsId
    );
  }, [filters, fetchInjectionsData, refreshTrigger, pageNo]);

  function onSubmit(values: z.infer<typeof injectionsSearchParams>) {
    if (values.userDetailsId === "all") {
      form.setValue("userDetailsId", "");
    }

    if (values.providerId === "all") {
      form.setValue("providerId", "");
    }

    setFilters({
      providerId: values.providerId || "",
      userDetailsId: values.userDetailsId || "",
      status: values.status || "",
    });
    setPageNo(1);
  }

  if (loading) return <LoadingButton />;

  return (
    <div className="space-y-2">
      <div className="space-y-2">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4"
          >
            {/* Ordered By Filter */}
            <FormField
              control={form.control}
              name="providerId"
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <FormControl>
                    <Select defaultValue={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by Ordered by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all" className="cursor-pointer">
                          All
                        </SelectItem>
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

            {/* Status Filter */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <FormControl>
                    <Select defaultValue={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all" className="cursor-pointer">
                          All
                        </SelectItem>
                        {Array.from(
                          new Set(
                            injectionsData?.map((injection) =>
                              injection?.status.toLowerCase()
                            )
                          )
                        ).map((status) => (
                          <SelectItem
                            key={status}
                            value={status}
                            className="cursor-pointer"
                          >
                            {status}
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
                <FormItem>
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
            <div className="flex items-end">
              <SubmitButton label="Search" />
            </div>
          </form>
        </Form>
        {/* <FilterInjections
          injectionsData={injectionsData}
          onHandleSearch={handleSearch}
        /> */}
      </div>
      <DefaultDataTable
        columns={columns({
          setLoading,
          showToast: () =>
            showToast({
              toast,
              type: "success",
              message: "Deleted Successfully",
            }),
          fetchInjectionList: () => fetchInjectionsData(pageNo),
        })}
        data={injectionsData}
        pageNo={pageNo}
        totalPages={totalPages}
        onPageChange={(newPage) => setPageNo(newPage)}
      />
    </div>
  );
}

export default InjectionsClient;
