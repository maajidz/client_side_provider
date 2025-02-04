import React, { useCallback, useEffect, useState } from "react";
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
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import LoadingButton from "@/components/LoadingButton";
import { getRecallsData } from "@/services/chartDetailsServices";
import { status } from "@/constants/data";
import { showToast } from "@/utils/utils";
import { useToast } from "@/components/ui/use-toast";
import {
  RecallsEditData,
  RecallsResponseInterface,
} from "@/types/recallsInterface";
import RecallsDialog from "@/components/charts/Encounters/Details/Recalls/RecallsDialog";
import { filterRecallsSchema } from "@/schema/recallFormSchema";
import { columns } from "./columns";
import ViewRecallDialog from "./ViewRecallsDialog";
import { z } from "zod";

const ViewRecalls = ({ userDetailsId }: { userDetailsId: string }) => {
  const providerDetails = useSelector((state: RootState) => state.login);
  const [resultList, setResultList] = useState<RecallsResponseInterface>();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<number>(1);
  const limit = 8;
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isDialogOpen, setIsDialogOpen] = useState({
    edit: false,
    view: false,
  });
  const [editData, setEditData] = useState<RecallsEditData | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof filterRecallsSchema>>({
    resolver: zodResolver(filterRecallsSchema),
    defaultValues: {
      type: "",
      status: "",
    },
  });

  const fetchRecalls = useCallback(
    async (page: number) => {
      setLoading(true);
      try {
        const response = await getRecallsData({
          page: page,
          limit: limit,
          userDetailsId: userDetailsId,
          providerId: providerDetails.providerId,
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
    [userDetailsId, providerDetails.providerId]
  );

  function onSubmit(values: z.infer<typeof filterRecallsSchema>) {
    console.log(values);
    // fetchTasksList(
    //   page,
    //   values.status,
    //   values.category,
    //   values.priority,
    //   values.userDetailsId
    // );
  }

  useEffect(() => {
    fetchRecalls(page);
  }, [page, fetchRecalls]);

  if (loading) {
    return <LoadingButton />;
  }

  return (
    <>
      <div className="">
        <Form {...form}>
          <form onChange={form.handleSubmit(onSubmit)} className="flex gap-5">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
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
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {status.map((status) => (
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

        {/* Results Table */}
        <div className="py-5">
          {resultList?.data && (
            <DataTable
              searchKey="id"
              columns={columns({
                setEditData,
                setIsDialogOpen,
                setLoading,
                showToast: () =>
                  showToast({
                    toast,
                    type: "success",
                    message: "Deleted Successfully",
                  }),
                fetchRecalls: () => fetchRecalls(page),
              })}
              data={resultList?.data}
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
      </div>
    </>
  );
};

export default ViewRecalls;
