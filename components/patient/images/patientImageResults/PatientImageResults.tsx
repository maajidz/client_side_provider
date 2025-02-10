import { DataTable } from "@/components/ui/data-table";
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
import { RootState } from "@/store/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";
import { columns } from "@/components/images/ImageResults/columns";
import LoadingButton from "@/components/LoadingButton";
import { getImageResults } from "@/services/imageResultServices";
import { ImageResultResponseInterface } from "@/types/imageResults";
import { filterImageResultsSchema } from "@/schema/createImageResultsSchema";
import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";

function PatientImageResults({ userDetailsId }: { userDetailsId: string }) {
  const providerDetails = useSelector((state: RootState) => state.login);
  const [resultList, setResultList] = useState<ImageResultResponseInterface>();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const form = useForm<z.infer<typeof filterImageResultsSchema>>({
    resolver: zodResolver(filterImageResultsSchema),
    defaultValues: {
      status: "",
    },
  });

  function onSubmit(values: z.infer<typeof filterImageResultsSchema>) {
    console.log(values);
  }

  const fetchImageResultsList = useCallback(
    async (page: number) => {
      try {
        setLoading(true);
        const limit = 5;
        if (providerDetails) {
          const response = await getImageResults({
            providerId: providerDetails.providerId,
            userDetailsId: userDetailsId,
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
        setLoading(false);
      }
    },
    [providerDetails, userDetailsId]
  );

  useEffect(() => {
    fetchImageResultsList(page);
  }, [page, fetchImageResultsList]);

  if (loading) {
    return <LoadingButton />;
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

          <div className="flex items-end">
            <SubmitButton label="Search" />
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

export default PatientImageResults;
