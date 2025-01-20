import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
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
// import { RootState } from "@/store/store";
import { LabOrdersDataInterface } from "@/types/chartsInterface";
import { zodResolver } from "@hookform/resolvers/zod";
import { columns } from "../../../lab/LabOrders/columns";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
// import { useSelector } from "react-redux";
import { z } from "zod";

interface OrderRecordsProps {
  userDetailsId: string;
}

function OrderRecords({ userDetailsId }: OrderRecordsProps) {
  // const providerDetails = useSelector((state: RootState) => state.login);
  const [orderList, setOrderList] = useState<LabOrdersDataInterface>();

  // Loading State
  const [loading, setLoading] = useState(false);

  // Pagination State
  const limit = 5;
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const form = useForm<z.infer<typeof filterLabOrdersSchema>>({
    resolver: zodResolver(filterLabOrdersSchema),
    defaultValues: {
      orderedby: "",
      status: "",
    },
  });

  function onSubmit(values: z.infer<typeof filterLabOrdersSchema>) {
    console.log(values);
  }

  const fetchLabOrdersList = useCallback(
    async (page: number) => {
      setLoading(true);

      try {
        const response = await getLabOrdersData({
          userDetailsId,
          limit,
          page,
        });
        if (response) {
          setOrderList(response);
          setTotalPages(Math.ceil(response.total / limit));
        }
      } catch (e) {
        console.log("Error", e);
      } finally {
        setLoading(false);
      }
    },
    [userDetailsId]
  );

  useEffect(() => {
    fetchLabOrdersList(page);
  }, [page, fetchLabOrdersList]);

  if (loading) {
    return <LoadingButton />;
  }

  return (
    <div>
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

          <div className="flex items-end">
            <Button type="submit">Search</Button>
          </div>
        </form>
      </Form>
      <div className="py-5">
        {orderList?.data && (
          <DataTable
            searchKey="id"
            columns={columns()}
            data={orderList?.data}
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

