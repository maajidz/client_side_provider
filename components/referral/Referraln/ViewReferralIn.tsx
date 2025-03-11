import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";
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
import {
  referralRequestStatus,
  referralResponseStatus,
} from "@/constants/data";
import TableShimmer from "@/components/custom_buttons/table/TableShimmer";

const ViewReferralIn = () => {
  const providerDetails = useSelector((state: RootState) => state.login);
  const [isReferralInDialogOpen, setIsReferralInDialogOpen] =
    useState<boolean>(false);
  const [resultList, setResultList] = useState<TransferResponseData[]>([]);
  const [ownersList, setOwnersList] = useState<FetchProviderList[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [filters, setFilters] = useState<{
    referralFrom: string;
    statusType: "responseStatus" | "requestStatus" | "";
    status: string;
  }>({
    referralFrom: "",
    statusType: "",
    status: "",
  });

  const form = useForm<z.infer<typeof referralInSearchParams>>({
    resolver: zodResolver(referralInSearchParams),
    defaultValues: {
      referralTo: "",
      statusType: "all",
      status: "",
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
      referralFrom: values.referralFrom || "",
      statusType: values.statusType === "all" ? "" : values.statusType || "",
      status: values.status === "all" ? "" : values.status || "",
    }));

    setPage(1);
  }

  const fetchReferralsList = useCallback(async () => {
    try {
      if (providerDetails) {
        const response = await getTransferData({
          id: providerDetails.providerId,
          idType: "Referring to ProviderID",
          statusType: filters.statusType ?? "responseStatus",
          status: filters.status,
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

          {/* Request Status Filter */}
          <FormField
            control={form.control}
            name="statusType"
            render={({ field }) => (
              <FormItem className={formStyles.formFilterItem}>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue("status", "");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Status Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="cursor-pointer">
                        All
                      </SelectItem>
                      <SelectItem value="requestStatus">
                        Request Status
                      </SelectItem>
                      <SelectItem value="responseStatus">
                        Response Status
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          {/* Status Filter */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className={formStyles.formFilterItem}>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="cursor-pointer">
                        All
                      </SelectItem>
                      {form.getValues("statusType") === "requestStatus"
                        ? referralRequestStatus.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))
                        : referralResponseStatus.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
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
      {loading && <TableShimmer />}
      {!loading && resultList && (
        <DefaultDataTable
          title={"Referral In"}
          onAddClick={() => setIsReferralInDialogOpen(true)}
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
