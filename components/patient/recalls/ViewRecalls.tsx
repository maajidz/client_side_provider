import DefaultButton from "@/components/custom_buttons/buttons/DefaultButton";
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
import { useToast } from "@/hooks/use-toast";
import {
  RecallsEditData,
  RecallsResponseInterface,
} from "@/types/recallsInterface";
import RecallsDialog from "@/components/charts/Encounters/Details/Recalls/RecallsDialog";
import { filterRecallsSchema } from "@/schema/recallFormSchema";
import { columns } from "./columns";
import ViewRecallDialog from "./ViewRecallsDialog";
import { PlusIcon } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { z } from "zod";

const ViewRecalls = ({ userDetailsId }: { userDetailsId: string }) => {
  const providerDetails = useSelector((state: RootState) => state.login);
  const [resultList, setResultList] = useState<RecallsResponseInterface>();
  const [loading, setLoading] = useState(true);
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
      <div className="flex justify-end">
        <DefaultButton
          onClick={() => {
            setIsDialogOpen((prev) => ({ ...prev, create: true }));
          }}
        >
          <PlusIcon />
          Recalls
        </DefaultButton>
        <RecallsDialog
          userDetailsId={userDetailsId}
          onClose={() => {
            setIsDialogOpen((prev) => ({ ...prev, create: false }));
            fetchRecalls();
          }}
          isOpen={isDialogOpen.create}
        />
      </div>
      <Form {...form}>
        <form className="flex gap-5">
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
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {status.map((status) => (
                        <SelectItem
                          key={status.value}
                          value={status.value.toLowerCase()}
                        >
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
      <div className="space-y-3 py-5">
        {loading ? (
          <LoadingButton />
        ) : (
          resultList?.data && (
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
                fetchRecalls: () => fetchRecalls(),
              })}
              data={resultList?.data}
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
