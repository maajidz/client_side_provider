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
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";
import { columns } from "./columns";
import LoadingButton from "@/components/LoadingButton";

function LabResults() {
  const providerDetails = useSelector((state: RootState) => state.login);
  const [resultList, setResultList] = useState<LabResultsInterface>();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const form = useForm<z.infer<typeof filterLabResultsSchema>>({
    resolver: zodResolver(filterLabResultsSchema),
    defaultValues: {
      reviewer: "",
      status: "",
      name: "",
    },
  });

  function onSubmit(values: z.infer<typeof filterLabResultsSchema>) {
    console.log(values);
  }

  const fetchLabResultsList = useCallback(async (page: number) => {
    try {
      if (providerDetails) {
        const response = await getLabResultList({
          providerId: providerDetails.providerId,
          limit: 2,
          page: page,
        });
        if (response) {
          setResultList(response);
          setTotalPages(Math.ceil(response.total / Number(response.limit)));
        }
        setLoading(false);
      }
    } catch (e) {
      console.log("Error", e);
    }
  }, [providerDetails]);

  useEffect(() => {
    fetchLabResultsList(page);
  }, [page, fetchLabResultsList]);

  if(loading){
    return <LoadingButton />
  }

  return (
    <>
      <div className="">
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
