import TableShimmer from "@/components/custom_buttons/shimmer/TableShimmer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { labOrderStatus } from "@/constants/data";
import { filterLabOrdersSchema } from "@/schema/createLabOrderSchema";
import { getLabOrdersData } from "@/services/chartsServices";
import { LabOrdersDataInterface } from "@/types/chartsInterface";
import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";
import { FetchProviderList } from "@/types/providerDetailsInterface";
import { fetchProviderListDetails } from "@/services/registerServices";
import { columns } from "../../../lab/LabOrders/columns";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface OrderRecordsProps {
  userDetailsId: string;
}

function OrderRecords({ userDetailsId }: OrderRecordsProps) {
  const [orderList, setOrderList] = useState<LabOrdersDataInterface>();
  const [providersList, setProvidersList] = useState<FetchProviderList[]>([]);
  const router = useRouter();

  // Loading State
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  // Pagination State
  const limit = 5;
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const [filters, setFilters] = useState({
    orderedby: "",
    status: "",
  });

  const form = useForm<z.infer<typeof filterLabOrdersSchema>>({
    resolver: zodResolver(filterLabOrdersSchema),
    defaultValues: {
      orderedby: "",
      status: "",
    },
  });

  function onSubmit(values: z.infer<typeof filterLabOrdersSchema>) {
    setFilters((prev) => ({
      ...prev,
      orderedby: values.orderedby === "all" ? "" : values.orderedby || "",
      status: values.status === "all" ? "" : values.status || "",
      patient: userDetailsId,
    }));

    setPage(1);
  }

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

  const fetchLabOrdersList = useCallback(
    async (page: number, status?: string, providerId?: string) => {
      setDataLoading(true);

      try {
        const response = await getLabOrdersData({
          userDetailsId,
          limit,
          page,
          providerId,
          status: status || filters.status,
          orderedBy: filters.orderedby,
        });
        if (response) {
          setOrderList(response);
          setTotalPages(Math.ceil(response.total / limit));
        }
      } catch (e) {
        console.log("Error", e);
        setOrderList(undefined);
      } finally {
        setDataLoading(false);
      }
    },
    [userDetailsId, filters]
  );

  useEffect(() => {
    fetchProvidersData();
  }, [fetchProvidersData]);

  useEffect(() => {
    fetchLabOrdersList(page);
  }, [page, fetchLabOrdersList, filters]);

  return (
    <div className="flex flex-col gap-3">
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
          <div className="flex items-end">
            <Button type="submit" variant={"default"} className="bg-primary">
              Search <Search />
            </Button>
          </div>
        </form>
      </Form>
      <div className="space-y-5">
        {dataLoading && <TableShimmer />}
        {!dataLoading && (
          <DefaultDataTable
            title={"Lab Orders"}
            onAddClick={() =>
              router.push(
                `/dashboard/provider/patient/${userDetailsId}/lab_records/create-lab-order`
              )
            }
            columns={columns()}
            data={orderList?.data || []}
            pageNo={page}
            totalPages={totalPages}
            onPageChange={(newPage: number) => setPage(newPage)}
          />
        )}
      </div>
    </div>
  );
}

export default OrderRecords;
