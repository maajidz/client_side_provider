import PageContainer from "@/components/layout/page-container";
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
import { getImagesOrdersData } from "@/services/chartsServices";
import { RootState } from "@/store/store";
import { ImageOrdersResponseInterface } from "@/types/chartsInterface";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";
import { columns } from "@/components/images/ImageOrders/columns";
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";
import { useRouter } from "next/navigation";
import { FetchProviderList } from "@/types/providerDetailsInterface";
import { fetchProviderListDetails } from "@/services/registerServices";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { imagesStatus } from "@/constants/data";
import TableShimmer from "@/components/custom_buttons/table/TableShimmer";

const PatientImageOrders = ({ userDetailsId }: { userDetailsId: string }) => {
  const providerDetails = useSelector((state: RootState) => state.login);
  const [ownersList, setOwnersList] = useState<FetchProviderList[]>([]);
  const [orderList, setOrderList] = useState<ImageOrdersResponseInterface>();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [filters, setFilters] = useState({
    orderedby: "",
    status: "",
  });

  const router = useRouter();

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
    }));

    setPage(1);
  }

  const fetchLabOrdersList = useCallback(
    async (page: number) => {
      try {
        setLoading(true);
        const limit = 4;
        if (providerDetails) {
          const response = await getImagesOrdersData({
            providerId: filters.orderedby || providerDetails.providerId,
            status: filters.status,
            limit,
            page,
            userDetailsId,
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
    [providerDetails, userDetailsId, filters]
  );

  const fetchOwnersList = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetchProviderListDetails({ page: 1, limit: 10 });

      if (response) {
        setOwnersList(response.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLabOrdersList(page);
    fetchOwnersList();
  }, [page, fetchLabOrdersList, fetchOwnersList]);

  return (
    <PageContainer>
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
                      {ownersList.map((owner) => (
                        <SelectItem
                          key={owner.id}
                          value={owner.providerDetails?.id || owner.id}
                        >
                          {owner.firstName} {owner.lastName}
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
          <div className="flex items-end">
            <Button type="submit" variant={"secondary"}>
              Search <Search />
            </Button>
          </div>
        </form>
      </Form>
      <div className="space-y-5">
        {loading && <TableShimmer />}
        {!loading && (
          <DefaultDataTable
            title={"Patient Image Orders"}
            onAddClick={() =>
              router.push(
                `/dashboard/provider/patient/${userDetailsId}/images/create_patient_image_orders`
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
    </PageContainer>
  );
};

export default PatientImageOrders;
