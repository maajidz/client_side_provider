import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { filterLabResultsSchema } from "@/schema/createLabResultsSchema";
import { getLabResultList } from "@/services/labResultServices";
import { RootState } from "@/store/store";
import { LabResultsInterface } from "@/types/labResults";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserData } from "@/types/userInterface";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";
import { columns } from "./columns";
import { fetchUserDataResponse } from "@/services/userServices";
import { FetchProviderList } from "@/types/providerDetailsInterface";
import { fetchProviderListDetails } from "@/services/registerServices";
import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";
import { useRouter } from "next/navigation";
import TableShimmer from "@/components/custom_buttons/table/TableShimmer";
import { useToast } from "@/hooks/use-toast";
import { showToast } from "@/utils/utils";

interface ILabResultsProps {
  userDetailsId?: string;
}

function LabResults({ userDetailsId }: ILabResultsProps) {
  //Provider Details
  const providerDetails = useSelector((state: RootState) => state.login);

  //Lab Results State
  const [resultList, setResultList] = useState<LabResultsInterface>();

  //Patient List State
  const [patientData, setPatientData] = useState<UserData[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  //Provider List State
  const [providersList, setProvidersList] = useState<FetchProviderList[]>([]);

  //Search States
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [visibleSearchList, setVisibleSearchList] = useState<boolean>(false);

  // Loading States
  const [loading, setLoading] = useState<boolean>(false);
  const [dataLoading, setDataLoading] = useState<boolean>(false);

  // Pagination State
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Filter State
  const [filters, setFilters] = useState({
    reviewer: providerDetails.providerId || "",
    status: "",
    patient: userDetailsId ?? "",
  });

  const router = useRouter();
  const { toast } = useToast();

  // Form Definition
  const form = useForm<z.infer<typeof filterLabResultsSchema>>({
    resolver: zodResolver(filterLabResultsSchema),
    defaultValues: {
      reviewer: "",
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
  const fetchProvidersData = useCallback(async (currentPage: number) => {
    setLoading(true);
    try {
      const response = await fetchProviderListDetails({
        page: currentPage,
        limit: 10,
      });
      setProvidersList(response.data);
    } catch (err) {
      console.error("Error fetching providers data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch Lab Results Data
  const fetchLabResultsList = useCallback(
    async (
      page: number,
      providerId?: string,
      userDetailsId?: string,
      status?: string
    ) => {
      setDataLoading(true);

      try {
        const response = await getLabResultList({
          providerId: providerId || filters.reviewer,
          userDetailsId: userDetailsId || filters.patient,
          status: status || filters.status,
          limit: 4,
          page: page,
        });
        if (response) {
          setResultList(response);
          setTotalPages(Math.ceil(response.total / Number(response.limit)));
        }
      } catch (e) {
        console.log("Error", e);
      } finally {
        setDataLoading(false);
      }
    },
    [filters.patient, filters.reviewer, filters.status]
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
  const filteredPatients = useMemo(
    () =>
      patientData.filter((patient) =>
        `${patient.user.firstName} ${patient.user.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      ),
    [patientData, searchTerm]
  );

  // Lab Results useEffect
  useEffect(() => {
    fetchLabResultsList(
      page,
      filters.reviewer,
      filters.patient,
      filters.status
    );
    fetchProvidersData(page);
  }, [page, fetchLabResultsList, fetchProvidersData, filters]);

  //  Submit handler function
  function onSubmit(values: z.infer<typeof filterLabResultsSchema>) {
    console.log(values.reviewer);
    setFilters((prev) => ({
      ...prev,

      reviewer:
        values.reviewer === "all"
          ? ""
          : values.reviewer || providerDetails?.providerId || "",
      status: values.status === "all" ? "" : values.status || "",
      patient: values.name || "",
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
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reviewer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reviewer</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(v) => {
                      field.onChange(v);
                      console.log(v);
                    }}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Reviewer" />
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

          {!userDetailsId && (
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
          )}

          <div className="flex items-end">
            <SubmitButton label="Search" />
          </div>
        </form>
      </Form>
      {dataLoading ? (
        <TableShimmer />
      ) : (
        <DefaultDataTable
          title={"Labs Results"}
          onAddClick={() => {
            router.push("/dashboard/provider/labs/create_lab_results");
          }}
          columns={columns()}
          data={resultList?.results || []}
          pageNo={page}
          totalPages={totalPages}
          onPageChange={(newPage: number) => setPage(newPage)}
        />
      )}
    </div>
  );
}

export default LabResults;
