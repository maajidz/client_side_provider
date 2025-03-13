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
import { RootState } from "@/store/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";
import { columns } from "@/components/images/ImageResults/columns";
import { getImageResults } from "@/services/imageResultServices";
import { ImageResultResponseInterface } from "@/types/imageResults";
import { filterImageResultsSchema } from "@/schema/createImageResultsSchema";
import PageContainer from "@/components/layout/page-container";
import { useRouter } from "next/navigation";
import { imagesStatus } from "@/constants/data";

function PatientImageResults({ userDetailsId }: { userDetailsId: string }) {
  const providerDetails = useSelector((state: RootState) => state.login);
  const [resultList, setResultList] = useState<ImageResultResponseInterface>();
  // const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const form = useForm<z.infer<typeof filterImageResultsSchema>>({
    resolver: zodResolver(filterImageResultsSchema),
    defaultValues: {
      status: "",
    },
  });

  const filters = form.watch();

  const router = useRouter();

  const fetchImageResultsList = useCallback(
    async (page: number) => {
      setDataLoading(true);
      try {
        const limit = 5;
        if (providerDetails) {
          const response = await getImageResults({
            providerId: providerDetails.providerId,
            userDetailsId,
            limit,
            page,
            status: filters.status == "all" ? "" : filters.status,
          });
          if (response) {
            setResultList(response);
            setTotalPages(Math.ceil(response.total / limit));
          }
        }
      } catch (e) {
        console.log("Error", e);
      } finally {
        setDataLoading(false);
      }
    },
    [filters.status, providerDetails, userDetailsId]
  );

  useEffect(() => {
    fetchImageResultsList(page);
  }, [page, fetchImageResultsList]);

  return (
    <PageContainer>
      <Form {...form}>
        <form className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
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
                      <SelectItem value="all" className="cursor-pointer">
                        All
                      </SelectItem>
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
        </form>
      </Form>
      <div className="space-y-5">
        {dataLoading && <TableShimmer />}
        {!dataLoading && (
          <DefaultDataTable
            title={"Patient Image Results"}
            onAddClick={() =>
              router.push(
                `/dashboard/provider/patient/${userDetailsId}/images/create_patient_image_results`
              )
            }
            columns={columns()}
            data={resultList?.data || []}
            pageNo={page}
            totalPages={totalPages}
            onPageChange={(newPage: number) => setPage(newPage)}
          />
        )}
      </div>
    </PageContainer>
  );
}

export default PatientImageResults;
