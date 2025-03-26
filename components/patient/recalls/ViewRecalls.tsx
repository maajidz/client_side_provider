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
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { getRecallsData } from "@/services/chartDetailsServices";
import { showToast } from "@/utils/utils";
import { useToast } from "@/hooks/use-toast";
import {
  RecallsEditData,
  RecallsResponseInterface,
} from "@/types/recallsInterface";
import RecallsDialog from "@/components/charts/Encounters/Details/Recalls/RecallsDialog";
import { filterRecallsSchema } from "@/schema/recallFormSchema";
import { columns } from "./columns";
import ViewRecallDialog from "./ViewRecallsDialog";
import React, { useCallback, useEffect, useState } from "react";
import { z } from "zod";
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";
import TableShimmer from "@/components/custom_buttons/shimmer/TableShimmer";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const ViewRecalls = ({ userDetailsId }: { userDetailsId: string }) => {
  const providerDetails = useSelector((state: RootState) => state.login);
  const [resultList, setResultList] = useState<RecallsResponseInterface>();
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const limit = 8;
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isDialogOpen, setIsDialogOpen] = useState({
    create: false,
    edit: false,
    view: false,
  });
  const [editData, setEditData] = useState<RecallsEditData | null>(null);
  const [filters, setFilters] = useState({
    type: "",
    status: "",
  });

  const { toast } = useToast();

  const form = useForm<z.infer<typeof filterRecallsSchema>>({
    resolver: zodResolver(filterRecallsSchema),
    defaultValues: {
      type: "",
      status: "",
    },
  });

  function onSubmit(values: z.infer<typeof filterRecallsSchema>) {
    setFilters((prev) => ({
      ...prev,

      status: values.status === "all" ? "" : values.status || "",
      type: values.type === "all" ? "" : values.type || "",
    }));

    setPage(1);
  }

  const fetchRecalls = useCallback(
    async (page: number, status?: string, type?: string) => {
      setLoading(true);
      try {
        const response = await getRecallsData({
          page: page,
          limit,
          userDetailsId,
          providerId: providerDetails.providerId,
          category: type || filters.type,
          status: status || filters.status,
        });
        if (response) {
          setResultList(response);
          setTotalPages(Math.ceil(response.total / limit));
        }
      } catch (e) {
        console.log("Error", e);
      } finally {
        setLoading(false);
      }
    },
    [filters, providerDetails.providerId, userDetailsId]
  );

  useEffect(() => {
    fetchRecalls(page, filters.status, filters.type);
  }, [fetchRecalls, filters, page]);

  return (
    <>
      <RecallsDialog
        userDetailsId={userDetailsId}
        onClose={() => {
          setIsDialogOpen((prev) => ({ ...prev, create: false }));
          fetchRecalls(page);
        }}
        isOpen={isDialogOpen.create}
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex gap-2 flex-row"
        >
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="flex-none">
                <FormLabel className="w-fit">Type</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-64 text-sm font-medium">
                      <SelectValue placeholder="Choose Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="Asynchronous Refill Visit">
                        Asynchronous Refill Visit
                      </SelectItem>
                      <SelectItem value="Synchronous Visit">
                        Synchronous Visit
                      </SelectItem>
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
              <FormItem className="flex-none">
                <FormLabel className="w-64">Status</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-64 text-sm font-medium">
                      <SelectValue
                        placeholder="Select Status"
                        className="capitalize"
                      >
                        {field.value
                          ? field.value.charAt(0).toUpperCase() +
                            field.value.slice(1)
                          : "Select Status"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="capitalize">
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
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

      {/* Results Table */}
      <div className="flex gap-6 flex-col">
        {loading ? (
          <TableShimmer />
        ) : (
          <DefaultDataTable
            title={"Patient Recalls"}
            onAddClick={() => {
              setIsDialogOpen((prev) => ({ ...prev, create: true }));
            }}
            columns={columns({
              setEditData,
              setIsDialogOpen,
              setLoading,
              showToast: ({ type, message }) => {
                showToast({
                  toast,
                  type: type === "success" ? "success" : "error",
                  message,
                });
              },
              fetchRecalls: () => fetchRecalls(page),
            })}
            data={resultList?.data || []}
            pageNo={page}
            totalPages={totalPages}
            onPageChange={(newPage: number) => setPage(newPage)}
          />
        )}

        <RecallsDialog
          userDetailsId={userDetailsId}
          recallsData={editData}
          onClose={() => {
            setIsDialogOpen((prev) => ({ ...prev, edit: false }));
            fetchRecalls(page);
          }}
          isOpen={isDialogOpen.edit}
        />

        {/* View Dialog */}
        <ViewRecallDialog
          userDetailsId={userDetailsId}
          isOpen={isDialogOpen.view}
          selectedRecallData={editData}
          onSetIsDialogOpen={setIsDialogOpen}
        />
      </div>
    </>
  );
};

export default ViewRecalls;
