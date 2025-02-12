import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";
import LoadingButton from "@/components/LoadingButton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { referralInSearchParams } from "@/schema/referralSchema";
import { getTransferData } from "@/services/chartsServices";
import { RootState } from "@/store/store";
import { TransferResponseData } from "@/types/chartsInterface";
import { zodResolver } from "@hookform/resolvers/zod";
import { columns } from "./columns";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";

const ViewReferralIn = () => {
  const providerDetails = useSelector((state: RootState) => state.login);
  const [resultList, setResultList] = useState<TransferResponseData[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const form = useForm<z.infer<typeof referralInSearchParams>>({
    resolver: zodResolver(referralInSearchParams),
  });

  const fetchReferralsList = useCallback(async () => {
    try {
      if (providerDetails) {
        const response = await getTransferData({
          id: providerDetails.providerId,
          idType: "Referring to ProviderID",
        });
        if (response) {
          setResultList(response);
          setTotalPages(response.length / 10);
        }
        setLoading(false);
      }
    } catch (e) {
      console.log("Error", e);
    }
  }, [providerDetails]);

  useEffect(() => {
    fetchReferralsList();
  }, [fetchReferralsList]);

  if (loading) {
    return <LoadingButton />;
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        <Form {...form}>
          <form className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {/* Referral To Filter */}
            <FormField
              control={form.control}
              name="referralTo"
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by Referral To" />
                      </SelectTrigger>
                      <SelectContent></SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {/* Referral From Filter */}
            <FormField
              control={form.control}
              name="referralFrom"
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by Referral From" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="external" className="cursor-pointer">
                          External
                        </SelectItem>
                        <SelectItem value="internal" className="cursor-pointer">
                          Internal
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {/* Selected Referral From Provider Filter */}
            <FormField
              control={form.control}
              name="referralProviderId"
              render={({ field }) => {
                const referralFrom = form.watch("referralFrom") ?? "";

                return (
                  <FormItem className="flex items-center">
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={
                          !["internal", "external"].includes(referralFrom)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="janeDoe">Jane</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                );
              }}
            />

            {/* Request Status Filter */}
            <FormField
              control={form.control}
              name="requestStatus"
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by Request Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all" className="cursor-pointer">
                          All
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {/* Response Status Filter */}
            <FormField
              control={form.control}
              name="responseStatus"
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by Response Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all" className="cursor-pointer">
                          All
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <div className="flex items-end pb-2">
              <SubmitButton label="Search" />
            </div>
          </form>
        </Form>

        {resultList && (
          <DefaultDataTable
            columns={columns()}
            data={resultList}
            pageNo={page}
            totalPages={totalPages}
            onPageChange={(newPage: number) => setPage(newPage)}
          />
        )}
      </div>
    </>
  );
};

export default ViewReferralIn;
