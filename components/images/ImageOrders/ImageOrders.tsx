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
import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";

function ImageOrders() {
  const providerDetails = useSelector((state: RootState) => state.login);
  const [orderList, setOrderList] = useState<ImageOrdersResponseInterface>();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const form = useForm<z.infer<typeof filterLabOrdersSchema>>({
    resolver: zodResolver(filterLabOrdersSchema),
    defaultValues: {
      orderedby: "",
      status: "",
      name: "",
    },
  });

  function onSubmit(values: z.infer<typeof filterLabOrdersSchema>) {
    console.log(values);
  }

  const fetchImageOrdersList = useCallback(
    async (page: number) => {
      try {
        setLoading(true);
        const limit = 4;
        if (providerDetails) {
          const response = await getImagesOrdersData({
            providerId: providerDetails.providerId,
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
    [providerDetails]
  );

  useEffect(() => {
    fetchImageOrdersList(page);
  }, [page, fetchImageOrdersList]);

  if (loading) {
    return <LoadingButton />;
  }

  return (
    <>
      <div className="">
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

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Search Patient" {...field} />
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
        <div className="py-5">
          {orderList?.data && (
            <DefaultDataTable
              columns={columns()}
              data={orderList?.data}
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

export default ImageOrders;
