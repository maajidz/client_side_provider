import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";
import { columns } from "@/components/injections/injection-orders/column";
import LoadingButton from "@/components/LoadingButton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { injectionsSearchParams } from "@/schema/injectionsAndVaccinesSchema";
import { getInjectionsData } from "@/services/injectionsServices";
import { RootState } from "@/store/store";
import { InjectionsInterface } from "@/types/injectionsInterface";
import { showToast } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { injectionStatus } from "@/constants/data";
import { FetchProviderList } from "@/types/providerDetailsInterface";
import { fetchProviderListDetails } from "@/services/registerServices";
import { Button } from "@/components/ui/button";
import InjectionOrders from "@/components/injections/injection-orders/InjectionOrders";

const ViewInjectionOrders = ({ userDetailsId }: { userDetailsId: string }) => {
  const providerDetails = useSelector((state: RootState) => state.login);
  const [isInjectionDialogOpen, setIsInjectionDialogOpen] =
    useState<boolean>(false);
  const [resultList, setResultList] = useState<InjectionsInterface[]>([]);
  const [ownersList, setOwnersList] = useState<FetchProviderList[]>([]);
  const [selectedOwner, setSelectedOwner] = useState<FetchProviderList>();
  const limit = 8;
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    status: "",
    providerId: "",
  });

  const form = useForm<z.infer<typeof injectionsSearchParams>>({
    resolver: zodResolver(injectionsSearchParams),
    defaultValues: {
      providerId: selectedOwner?.providerDetails?.id ?? "",
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

  function onSubmit(values: z.infer<typeof injectionsSearchParams>) {
    setFilters((prev) => ({
      ...prev,
      status: values.status === "all" ? "" : values.status || "",
      providerId: values.providerId === "all" ? "" : values.providerId || "",
    }));

    setPage(1);
  }

  const fetchInjectionsData = useCallback(
    async (
      page: number,
      userDetailsId: string,
      status?: string,
      providerId?: string
    ) => {
      try {
        setLoading(true);
        if (providerDetails) {
          const response = await getInjectionsData({
            providerId: providerId || filters.providerId,
            limit: limit,
            page: page,
            status: status || filters.status,
            userDetailsId,
          });
          if (response) {
            setResultList(response.data);
            setTotalPages(Math.ceil(response.total / Number(response.limit)));
          }
          setLoading(false);
        }
      } catch (e) {
        console.log("Error", e);
      } finally {
        setLoading(false);
      }
    },
    [providerDetails, filters]
  );

  useEffect(() => {
    fetchInjectionsData(page, userDetailsId);
  }, [page, fetchInjectionsData, userDetailsId]);

  const handleInjectionDialogClose = () => {
    setIsInjectionDialogOpen(false);
    fetchInjectionsData(page, userDetailsId);
  };

  if (loading) {
    return <LoadingButton />;
  }

  return (
    <div className="flex flex-col gap-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-row gap-2 w-fit"
        >
          <FormField
            control={form.control}
            name="providerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Provider</FormLabel>
                <FormControl>
                  <Select
                    defaultValue={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      const selected = ownersList.find(
                        (owner) => owner.providerDetails?.id === value
                      );
                      setSelectedOwner(selected);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Owner" />
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
                      {injectionStatus.map((status) => (
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
          <div className="flex items-end">
            <Button variant={"secondary"}>Search</Button>
          </div>
        </form>
      </Form>
      {resultList && (
        <DefaultDataTable
          title={"Injection Order"}
          onAddClick={() => {
            setIsInjectionDialogOpen(true);
          }}
          columns={columns({
            setLoading,
            showToast: () =>
              showToast({
                toast,
                type: "success",
                message: "Deleted Successfully",
              }),
            fetchInjectionList: () => fetchInjectionsData(page, userDetailsId),
          })}
          data={resultList}
          pageNo={page}
          totalPages={totalPages}
          onPageChange={(newPage: number) => setPage(newPage)}
        />
      )}
      <InjectionOrders
        isOpen={isInjectionDialogOpen}
        onClose={() => handleInjectionDialogClose()}
      />
    </div>
  );
};

export default ViewInjectionOrders;
