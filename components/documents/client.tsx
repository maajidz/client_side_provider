"use client";

import { DefaultDataTable } from "../custom_buttons/table/DefaultDataTable";
import { getDocumentsData } from "@/services/documentsServices";
import { fetchProviderListDetails } from "@/services/registerServices";
import { fetchUserDataResponse } from "@/services/userServices";
import { searchParamsForDocumentsSchema } from "@/schema/documentsSchema";
import { DocumentsInterface } from "@/types/documentsInterface";
import { FetchProviderList } from "@/types/providerDetailsInterface";
import { UserData } from "@/types/userInterface";
import { showToast } from "@/utils/utils";
import { useToast } from "@/hooks/use-toast";
import { columns } from "./column";
import { useCallback, useEffect, useState } from "react";
import { z } from "zod";
import TableShimmer from "../custom_buttons/shimmer/TableShimmer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import SubmitButton from "../custom_buttons/buttons/SubmitButton";

function DocumentsClient() {
  // Documents List State
  const [documentsData, setDocumentsData] = useState<DocumentsInterface[]>([]);

  //Patient State
  const [userInfo, setUserInfo] = useState<UserData[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  // Provider List State
  const [providersList, setProvidersList] = useState<FetchProviderList[]>([]);

  // Search State
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [visibleSearchList, setVisibleSearchList] = useState<boolean>(false);

  // Filter State
  const [filters, setFilters] = useState({
    reviewer: "all",
    status: "all",
    patient: "",
  });

  // Pagination States
  const itemsPerPage = 10;
  const [pageNo, setPageNo] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Loading States
  const [loading, setLoading] = useState<boolean>(false);
  const [dataLoading, setDataLoading] = useState<boolean>(false);

  // Toast State
  const { toast } = useToast();

  // Form Definition
  const form = useForm<z.infer<typeof searchParamsForDocumentsSchema>>({
    resolver: zodResolver(searchParamsForDocumentsSchema),
    defaultValues: {
      patient: "",
      reviewer: "",
      status: "",
    },
  });

  // GET Patients Data
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
        setUserInfo(response.data);
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
        page: pageNo,
        limit: itemsPerPage,
      });
      setProvidersList(response.data);
    } catch (err) {
      console.error("Error fetching providers data:", err);
    } finally {
      setLoading(false);
    }
  }, [pageNo]);

  // Fetch Documents Data
  const fetchDocumentsData = useCallback(
    async (
      page: number,
      userDetailsId: string,
      reviewerId?: string,
      status?: string
    ) => {
      setDataLoading(true);

      try {
        const response = await getDocumentsData({
          userDetailsId: userDetailsId || filters.patient,
          reviewerId: reviewerId || filters.reviewer,
          status: status || filters.status,
          limit: 10,
          page: page,
        });
        setDocumentsData(response.data);
        setTotalPages(response.meta.totalPages);
      } catch (err) {
        if (err instanceof Error) {
          showToast({
            toast,
            type: "error",
            message: "Could not fetch documents for selected patient",
          });
        }
      } finally {
        setDataLoading(false);
      }
    },
    [filters.patient, filters.reviewer, filters.status, toast]
  );

  // Patient useEffect
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim()) {
        fetchUserData();
      } else {
        setUserInfo([]);
        setSelectedUser(null);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchUserData]);

  // Filter Patients
  const filteredPatients = userInfo.filter((patient) =>
    `${patient.user.firstName} ${patient.user.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Effects
  useEffect(() => {
    fetchProvidersData();
    fetchDocumentsData(
      pageNo,
      filters.patient,
      filters.reviewer,
      filters.status
    );
  }, [
    fetchProvidersData,
    fetchDocumentsData,
    filters.patient,
    filters.reviewer,
    filters.status,
    pageNo,
  ]);

  //  Submit handler function
  function onSubmit(values: z.infer<typeof searchParamsForDocumentsSchema>) {
    setFilters((prev) => ({
      ...prev,

      reviewer: values.reviewer === "all" ? "" : values.reviewer || "",
      status: values.status === "all" ? "" : values.status || "",
      patient: values.patient || "",
    }));

    setPageNo(1);
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form
          className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {/* Reviewer Filter */}
          <FormField
            control={form.control}
            name="reviewer"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by Reviewer" />
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
                                {selectedUser?.patientId}
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
                </FormItem>
              </div>
            )}
          />

          {/* Status Filter */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="cursor-pointer">
                    All
                  </SelectItem>
                  <SelectItem value="completed" className="cursor-pointer">
                    Completed
                  </SelectItem>
                  <SelectItem value="pending" className="cursor-pointer">
                    Pending
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />

          {/* Search Button */}
          <div className="flex justify-center items-center w-full sm:w-auto">
            <SubmitButton label="Search" />
          </div>
        </form>
      </Form>
      <>
        {dataLoading ? (
          <TableShimmer />
        ) : (
          <DefaultDataTable
            title="Document"
            columns={columns()}
            data={documentsData || []}
            pageNo={pageNo}
            totalPages={totalPages}
            onPageChange={(newPage) => setPageNo(newPage)}
          />
        )}
      </>
    </div>
  );
}

export default DocumentsClient;
