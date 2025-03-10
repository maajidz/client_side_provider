import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";
import LoadingButton from "@/components/LoadingButton";
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
import { filterLabOrdersSchema } from "@/schema/createLabOrderSchema";
import { getLabOrdersData } from "@/services/chartsServices";
import { LabOrdersDataInterface } from "@/types/chartsInterface";
import { zodResolver } from "@hookform/resolvers/zod";
import { columns } from "../../../lab/LabOrders/columns";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";
import { useRouter } from "next/navigation";
import { FetchProviderList } from "@/types/providerDetailsInterface";
import { fetchProviderListDetails } from "@/services/registerServices";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { labOrderStatus } from "@/constants/data";

interface OrderRecordsProps {
  userDetailsId: string;
}

function OrderRecords({ userDetailsId }: OrderRecordsProps) {
  const providerDetails = useSelector((state: RootState) => state.login);
  const [orderList, setOrderList] = useState<LabOrdersDataInterface>();
  const [providersList, setProvidersList] = useState<FetchProviderList[]>([]);
  const router = useRouter();

  // Loading State
  const [loading, setLoading] = useState(false);

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
      setLoading(true);

      try {
        const response = await getLabOrdersData({
          userDetailsId,
          limit,
          page,
          providerId: providerId || filters.orderedby,
          status: status || filters.status,
          orderedBy: providerDetails.providerId,
        });
        if (response) {
          setOrderList(response);
          setTotalPages(Math.ceil(response.total / limit));
        }
      } catch (e) {
        console.log("Error", e);
        setOrderList(undefined);
      } finally {
        setLoading(false);
      }
    },
    [userDetailsId, filters, providerDetails.providerId]
  );

  useEffect(() => {
    fetchProvidersData();
  }, [fetchProvidersData]);

  useEffect(() => {
    fetchLabOrdersList(page);
  }, [page, fetchLabOrdersList, filters]);

  if (loading) {
    return <LoadingButton />;
  }

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
                      <SelectValue placeholder="Select Reviewer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
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
            <SubmitButton label="Search" />
          </div>
        </form>
      </Form>
      <div className="space-y-5">
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
      </div>
    </div>
  );
}

export default OrderRecords;
