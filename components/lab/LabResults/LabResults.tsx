import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
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
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";
import { columns } from "./columns";
import LoadingButton from "@/components/LoadingButton";
import { fetchUserDataResponse } from "@/services/userServices";
import { FetchProviderList } from "@/types/providerDetailsInterface";
import { fetchProviderListDetails } from "@/services/registerServices";

function LabResults() {
  const providerDetails = useSelector((state: RootState) => state.login);
  const [resultList, setResultList] = useState<LabResultsInterface>();
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Patient State
  const [patientData, setPatientData] = useState<UserData[]>([]);

  // Providers State
  const [providersList, setProvidersList] = useState<FetchProviderList[]>([]);

  // Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleSearchList, setVisibleSearchList] = useState<boolean>(false);

  // Filter State
  const [filters, setFilters] = useState({
    reviewer: providerDetails.providerId || "",
    status: "",
    patient: "",
  });

  // Loading State
  const [loading, setLoading] = useState({
    patients: false,
    providers: false,
    labResults: false,
  });

  const form = useForm<z.infer<typeof filterLabResultsSchema>>({
    resolver: zodResolver(filterLabResultsSchema),
    defaultValues: {
      reviewer: "",
      status: "",
      name: "",
    },
  });

  function onSubmit(values: z.infer<typeof filterLabResultsSchema>) {
    setFilters((prev) => ({
      ...prev,

      reviewer: values.reviewer || providerDetails?.providerId || "",
      status: values.status === "all" ? "" : values.status || "",
      patient: values.name || "",
    }));

    setPage(1);
  }

  // GET Patients' Data
  const fetchPatientData = useCallback(async () => {
    setLoading((prev) => ({ ...prev, patients: true }));

    try {
      const response = await fetchUserDataResponse({ pageNo: page });

      if (response) {
        setPatientData(response.data);
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
    } finally {
      setLoading((prev) => ({ ...prev, patients: false }));
    }
  }, [page]);

  // Fetch Providers Data
  const fetchProvidersData = useCallback(async () => {
    setLoading((prev) => ({ ...prev, providers: true }));

    try {
      const response = await fetchProviderListDetails({
        page: page,
        limit: 10,
      });
      setProvidersList(response.data);
    } catch (err) {
      console.error("Error fetching providers data:", err);
    } finally {
      setLoading((prev) => ({ ...prev, providers: false }));
    }
  }, [page]);

  const fetchLabResultsList = useCallback(
    async (page: number) => {
      setLoading((prev) => ({ ...prev, labResults: true }));

      try {
        if (providerDetails) {
          const response = await getLabResultList({
            providerId: filters.reviewer,
            userDetailsId: filters.patient,
            status: filters.status,
            limit: 4,
            page: page,
          });
          if (response) {
            setResultList(response);
            setTotalPages(Math.ceil(response.total / Number(response.limit)));
          }
        }
      } catch (e) {
        console.log("Error", e);
      } finally {
        setLoading((prev) => ({ ...prev, labResults: false }));
      }
    },
    [providerDetails, filters]
  );

  useEffect(() => {
    fetchLabResultsList(page);
    fetchPatientData();
    fetchProvidersData();
  }, [page, fetchLabResultsList, fetchPatientData, fetchProvidersData]);

  const filteredPatients = patientData.filter((patient) =>
    `${patient.user.firstName} ${patient.user.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (loading.labResults || loading.patients || loading.providers) {
    return <LoadingButton />;
  }

  return (
    <>
      <div>
        {/* Search Form */}
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
                        {Array.from(
                          new Set(
                            resultList?.results.map((result) => result?.status)
                          )
                        ).map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
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
              name="reviewer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reviewer</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Reviewer" />
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
                              key={provider.providerDetails.id}
                              value={provider.providerDetails.id}
                              className="cursor-pointer"
                            >
                              {provider.firstName} {provider.lastName}
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
              <Button type="submit">Search</Button>
            </div>
          </form>
        </Form>

        {/* Results Table */}
        <div className="py-5">
          {resultList?.results && (
            <DataTable
              searchKey="id"
              columns={columns()}
              data={resultList?.results}
              pageNo={page}
              totalPages={totalPages}
              onPageChange={(newPage: number) => setPage(newPage)}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default LabResults;
