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
import formStyles from "@/components/formStyles.module.css";
import { FetchProviderList } from "@/types/providerDetailsInterface";
import { fetchProviderListDetails } from "@/services/registerServices";
import ReferralInDialog from "./ReferralInDialog";

const ViewReferralIn = () => {
  const providerDetails = useSelector((state: RootState) => state.login);
  const [isReferralInDialogOpen, setIsReferralInDialogOpen] =
    useState<boolean>(false);
  const [resultList, setResultList] = useState<TransferResponseData[]>([]);
  const [ownersList, setOwnersList] = useState<FetchProviderList[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [filters, setFilters] = useState({
    referralTo: "",
    requestStatus: "",
    responseStatus: "",
  });

  const form = useForm<z.infer<typeof referralInSearchParams>>({
    resolver: zodResolver(referralInSearchParams),
    defaultValues: {
      referralTo: "",
      requestStatus: "",
      responseStatus: "",
    },
  });

  const fetchOwnersList = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetchProviderListDetails({ page: 1, limit: 10 });

      if (response) {
        setOwnersList(response.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOwnersList();
  }, [fetchOwnersList]);

  function onSubmit(values: z.infer<typeof referralInSearchParams>) {
    setFilters((prev) => ({
      ...prev,
      referralTo: values.referralTo === "all" ? "" : values.referralTo || "",
      requestStatus:
        values.requestStatus === "all" ? "" : values.requestStatus || "",
      responseStatus:
        values.responseStatus === "all" ? "" : values.responseStatus || "",
    }));

    setPage(1);
  }

  const fetchReferralsList = useCallback(async () => {
    try {
      if (providerDetails) {
        const response = await getTransferData({
          id: providerDetails.providerId,
          idType: "Referring to ProviderID",
          status: filters.responseStatus ?? "",
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
  }, [providerDetails, filters]);

  useEffect(() => {
    fetchReferralsList();
  }, [fetchReferralsList]);

  const handleReferralInDialogClose = () => {
    setIsReferralInDialogOpen(false);
    fetchReferralsList();
  };

  if (loading) {
    return <LoadingButton />;
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={formStyles.formFilterBody}
        >
          <FormField
            control={form.control}
            name="referralTo"
            render={({ field }) => (
              <FormItem className={formStyles.formFilterItem}>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by Referral To" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {ownersList.map((owner) => (
                        <SelectItem
                          key={owner.id}
                          value={owner.providerDetails?.id || owner.id}
                        >
                          {owner.firstName} {owner.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          {/* Referral From Filter */}
          {/* <FormField
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
            /> */}

          {/* Selected Referral From Provider Filter */}
          {/* <FormField
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
            /> */}

          {/* Request Status Filter */}
          <FormField
            control={form.control}
            name="requestStatus"
            render={({ field }) => (
              <FormItem className={formStyles.formFilterItem}>
                <FormControl>
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
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
              <FormItem className={formStyles.formFilterItem}>
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
          title={"Referral In"}
          columns={columns()}
          data={resultList}
          pageNo={page}
          totalPages={totalPages}
          onPageChange={(newPage: number) => setPage(newPage)}
        />
      )}
      <ReferralInDialog
        onClose={handleReferralInDialogClose}
        isOpen={isReferralInDialogOpen}
      />
    </div>
  );
};

export default ViewReferralIn;
