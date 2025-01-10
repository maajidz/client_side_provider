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
import { RootState } from "@/store/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";
import { columns } from "./columns";
import LoadingButton from "@/components/LoadingButton";
import { getImageResults } from "@/services/imageResultServices";
import { ImageResultResponseInterface } from "@/types/imageResults";
import { filterImageResultsSchema } from "@/schema/createImageResultsSchema";

function ImageResults() {
  const providerDetails = useSelector((state: RootState) => state.login);
  const [resultList, setResultList] = useState<ImageResultResponseInterface>();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const form = useForm<z.infer<typeof filterImageResultsSchema>>({
    resolver: zodResolver(filterImageResultsSchema),
    defaultValues: {
      status: "",
      name: "",
    },
  });

  function onSubmit(values: z.infer<typeof filterImageResultsSchema>) {
    console.log(values);
  }

  const fetchImageResultsList = useCallback(async (page: number) => {
    try {
        setLoading(true)
        const limit = 5;
      if (providerDetails) {
        const response = await getImageResults({
          providerId: providerDetails.providerId,
          userDetailsId: "97f41397-3fe3-4f0b-a242-d3370063db33",
          limit: limit,
          page: page,
        });
        if (response) {
          setResultList(response);
          setTotalPages(Math.ceil(response.total / limit));
        }
        setLoading(false);
      }
    } catch (e) {
      console.log("Error", e);
    } finally {
        setLoading(false)
    }
  }, [providerDetails]);

  useEffect(() => {
    fetchImageResultsList(page);
  }, [page, fetchImageResultsList]);

  if(loading){
    return <LoadingButton />
  }

  return (
    <>
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
        <div className="py-5">
          {resultList?.data && (
            <DataTable
              searchKey="id"
              columns={columns()}
              data={resultList?.data}
              pageNo={page}
              totalPages={totalPages}
              onPageChange={(newPage: number) => setPage(newPage)}
            />
          )}
        </div>
    </>
  );
}

export default ImageResults;
