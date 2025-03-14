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
  const { toast } = useToast();

  const form = useForm<z.infer<typeof filterRecallsSchema>>({
    resolver: zodResolver(filterRecallsSchema),
    defaultValues: {
      type: "all",
      status: "all",
    },
  });

  const filters = form.watch();

  const fetchRecalls = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getRecallsData({
        page,
        limit,
        userDetailsId,
        providerId: providerDetails.providerId,
        category: filters.type === "all" ? "" : filters.type,
        status: filters.status === "all" ? "" : filters.status,
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
  }, [
    filters.type,
    filters.status,
    providerDetails.providerId,
    page,
    userDetailsId,
  ]);

  useEffect(() => {
    fetchRecalls();
  }, [fetchRecalls]);

  return (
    <>
      <RecallsDialog
        userDetailsId={userDetailsId}
        onClose={() => {
          setIsDialogOpen((prev) => ({ ...prev, create: false }));
          fetchRecalls();
        }}
        isOpen={isDialogOpen.create}
      />
      <Form {...form}>
        <form className="flex gap-2 w-fit">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel className="w-fit">Type</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
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
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
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
        </form>
      </Form>

      {/* Results Table */}
      <div className="flex gap-6 flex-col">
        {loading ? (
          <TableShimmer />
        ) : (
          resultList?.data && (
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
                fetchRecalls: () => fetchRecalls(),
              })}
              data={resultList?.data || []}
              pageNo={page}
              totalPages={totalPages}
              onPageChange={(newPage: number) => setPage(newPage)}
            />
          )
        )}

        <RecallsDialog
          userDetailsId={userDetailsId}
          recallsData={editData}
          onClose={() => {
            setIsDialogOpen((prev) => ({ ...prev, edit: false }));
            fetchRecalls();
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
