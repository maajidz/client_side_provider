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
import { referralOutSearchParams } from "@/schema/referralSchema";
import { getTransferData } from "@/services/chartsServices";
import { RootState } from "@/store/store";
import { TransferResponseData } from "@/types/chartsInterface";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  referralRequestStatus,
  referralResponseStatus,
} from "@/constants/data";
import { columns } from "./columns";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";
import formStyles from "@/components/formStyles.module.css";
import { FetchProviderList } from "@/types/providerDetailsInterface";
import { fetchProviderListDetails } from "@/services/registerServices";
import ReferralOutDialog from "./ReferralOutDialog";
import TableShimmer from "@/components/custom_buttons/table/TableShimmer";

const ViewReferralOut = () => {
  const providerDetails = useSelector((state: RootState) => state.login);
  const [resultList, setResultList] = useState<TransferResponseData[]>([]);
  const [isReferralOutDialogOpen, setIsReferralOutDialogOpen] =
    useState<boolean>(false);
  const [ownersList, setOwnersList] = useState<FetchProviderList[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
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

  const form = useForm<z.infer<typeof referralOutSearchParams>>({
    resolver: zodResolver(referralOutSearchParams),
    defaultValues: {
      referralFrom: "",
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

  function onSubmit(values: z.infer<typeof referralOutSearchParams>) {
    setFilters((prev) => ({
      ...prev,
      referralFrom:
        values.referralFrom === "all" ? "" : values.referralFrom || "",
      statusType: values.statusType === "all" ? "" : values.statusType || "",
      status: values.status === "all" ? "" : values.status || "",
    }));

    setPage(1);
  }

  const fetchReferralsList = useCallback(async () => {
    setDataLoading(true);

    try {
      const response = await getTransferData({
        id: providerDetails.providerId,
        idType: "Referring from ProviderID",
        statusType: filters.statusType ?? "responseStatus",
        status: filters.status,
      });
      if (response) {
        setResultList(response);
        setTotalPages(Math.ceil(response.length / 10));
      }
    } catch (e) {
      console.log("Error", e);
    } finally {
      setDataLoading(false);
    }
  }, [filters, providerDetails]);

  useEffect(() => {
    fetchReferralsList();
  }, [fetchReferralsList]);

  const handleReferralOutDialogClose = () => {
    setIsReferralOutDialogOpen(false);
    fetchReferralsList();
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={formStyles.formFilterBody}
        >
          {/* Referral To Filter */}
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

          {/* Selected Referral To Provider Filter */}
          <FormField
            control={form.control}
            name="referralProviderId"
            render={({ field }) => {
              const referralTo = form.watch("referralTo") ?? "";

              return (
                <FormItem className={formStyles.formFilterItem}>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!["internal", "external"].includes(referralTo)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {loading ? (
                          <div>Loading...</div>
                        ) : (
                          ownersList.map((owner) => (
                            <SelectItem
                              key={owner.id}
                              value={owner.providerDetails?.id || owner.id}
                            >
                              {owner.firstName} {owner.lastName}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              );
            }}
          />

          {/* Status Type Filter */}
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
      {dataLoading && <TableShimmer />}
      {!dataLoading && resultList && (
        <DefaultDataTable
          title={"Referral Out"}
          onAddClick={() => {
            setIsReferralOutDialogOpen(true);
          }}
          columns={columns()}
          data={resultList}
          pageNo={page}
          totalPages={totalPages}
          onPageChange={(newPage: number) => setPage(newPage)}
        />
      )}
      <ReferralOutDialog
        onClose={handleReferralOutDialogClose}
        isOpen={isReferralOutDialogOpen}
      />
    </div>
  );
};

export default ViewReferralOut;
