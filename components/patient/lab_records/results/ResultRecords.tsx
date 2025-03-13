import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";
import TableShimmer from "@/components/custom_buttons/table/TableShimmer";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { filterLabResultsSchema } from "@/schema/createLabResultsSchema";
import { getLabResultList } from "@/services/labResultServices";
import { fetchProviderListDetails } from "@/services/registerServices";
import { LabResultsInterface } from "@/types/labResults";
import { FetchProviderList } from "@/types/providerDetailsInterface";
import { zodResolver } from "@hookform/resolvers/zod";
import { columns } from "../../../lab/LabResults/columns";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface ResultRecordsProps {
  userDetailsId: string;
}

function ResultRecords({ userDetailsId }: ResultRecordsProps) {
  // Data State
  const [resultList, setResultList] = useState<LabResultsInterface>();

  // Pagination State
  const limit = 5;
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const router = useRouter();

  // Providers State
  const [providersList, setProvidersList] = useState<FetchProviderList[]>([]);

  // Filter State
  const [filters, setFilters] = useState({
    reviewer: "",
    status: "",
  });

  // Loading State
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  const form = useForm<z.infer<typeof filterLabResultsSchema>>({
    resolver: zodResolver(filterLabResultsSchema),
    defaultValues: {
      reviewer: "",
      status: "",
    },
  });

  function onSubmit(values: z.infer<typeof filterLabResultsSchema>) {
    setFilters((prev) => ({
      ...prev,

      reviewer: values.reviewer === "all" ? "" : values.reviewer || "",
      status: values.status === "all" ? "" : values.status || "",
      patient: "",
    }));

    setPage(1);
  }

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

  const fetchLabResultsList = useCallback(
    async (page: number) => {
      setDataLoading(true);

      try {
        const response = await getLabResultList({
          userDetailsId,
          providerId: filters.reviewer,
          status: filters.status,
          limit,
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
    [filters, userDetailsId]
  );

  useEffect(() => {
    fetchLabResultsList(page);
    fetchProvidersData();
  }, [page, fetchLabResultsList, fetchProvidersData]);

  return (
    <div className="flex flex-col gap-6">
      {/* Search Form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-2 md:grid-cols-3 lg:grid-cols-4"
        >
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
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
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

      {/* Results Table */}
      <div className="flex flex-col gap-6">
        {dataLoading && <TableShimmer />}
        {!dataLoading && resultList?.results && (
          <DefaultDataTable
            title={"Lab Results"}
            onAddClick={() => {
              router.push(
                `/dashboard/provider/patient/${userDetailsId}/lab_records/create-lab-result`
              );
            }}
            columns={columns()}
            data={resultList?.results}
            pageNo={page}
            totalPages={totalPages}
            onPageChange={(newPage: number) => setPage(newPage)}
          />
        )}
      </div>
    </div>
  );
}

export default ResultRecords;
