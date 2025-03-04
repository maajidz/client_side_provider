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
import LoadingButton from "@/components/LoadingButton";
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";
import { useRouter } from "next/navigation";

const PatientImageOrders = ({ userDetailsId }: { userDetailsId: string }) => {
  const providerDetails = useSelector((state: RootState) => state.login);
  const [orderList, setOrderList] = useState<ImageOrdersResponseInterface>();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const router = useRouter();

  const form = useForm<z.infer<typeof filterLabOrdersSchema>>({
    resolver: zodResolver(filterLabOrdersSchema),
    defaultValues: {
      orderedby: "",
      status: "",
    },
  });

  const fetchLabOrdersList = useCallback(
    async (page: number) => {
      try {
        setLoading(true);
        const limit = 4;
        if (providerDetails) {
          const response = await getImagesOrdersData({
            providerId: providerDetails.providerId,
            limit: limit,
            page: page,
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
    [providerDetails, userDetailsId]
  );

  useEffect(() => {
    fetchLabOrdersList(page);
  }, [page, fetchLabOrdersList]);

  if (loading) {
    return <LoadingButton />;
  }

  return (
    <PageContainer scrollable={true}>
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
                      <SelectValue placeholder="Select Reviewer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reviewer1">Reviewer</SelectItem>
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
        </form>
      </Form>
      <div className="space-y-5">
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
      </div>
    </PageContainer>
  );
};

export default PatientImageOrders;
