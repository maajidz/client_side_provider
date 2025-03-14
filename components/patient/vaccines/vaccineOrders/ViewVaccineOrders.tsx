import { getVaccinesData } from "@/services/injectionsServices";
import { VaccinesInterface } from "@/types/injectionsInterface";
import { useCallback, useEffect, useState } from "react";
import { vaccineSearchParams } from "@/schema/injectionsAndVaccinesSchema";
import { z } from "zod";
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";
import { columns } from "./VaccineColumn";
import { useToast } from "@/hooks/use-toast";
import { showToast } from "@/utils/utils";
import { FetchProviderList } from "@/types/providerDetailsInterface";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fetchProviderListDetails } from "@/services/registerServices";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import VaccineOrders from "@/components/injections/vaccine-orders/VaccineOrders";
import TableShimmer from "@/components/custom_buttons/table/TableShimmer";

function ViewVaccineOrders({ userDetailsId }: { userDetailsId: string }) {
  // Data State
  const [vaccinesData, setVaccinesData] = useState<VaccinesInterface[]>([]);
  const [providersList, setProvidersList] = useState<FetchProviderList[]>([]);
  const [isVaccineDialogOpen, setIsVaccineDialogOpen] =
    useState<boolean>(false);

  // Pagination State
  const itemsPerPage = 10;
  const [pageNo, setPageNo] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters State
  const [filters, setFilters] = useState({
    providerId: "",
    status: "",
  });

  // Loading State
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof vaccineSearchParams>>({
    resolver: zodResolver(vaccineSearchParams),
    defaultValues: {
      providerId: "",
      status: "",
    },
  });

  // Fetch Providers Data
  const fetchProvidersData = useCallback(async () => {
    try {
      const response = await fetchProviderListDetails({ page: 1, limit: 10 });

      setProvidersList(response.data);
    } catch (err) {
      if (err instanceof Error) {
        showToast({
          toast,
          type: "error",
          message: "Could not fetch providers",
        });
      } else {
        showToast({
          toast,
          type: "error",
          message: "An unknown error occurred",
        });
      }
    }
  }, [toast]);

  useEffect(() => {
    fetchProvidersData();
  }, [fetchProvidersData]);

  // GET Injections Data
  const fetchVaccineOrderData = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getVaccinesData({
        userDetailsId: userDetailsId,
        providerId: filters.providerId,
        status: filters.status,
        page: pageNo,
        limit: itemsPerPage,
      });

      if (response) {
        setVaccinesData(response.data);
        setTotalPages(Math.ceil(response.total / itemsPerPage));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [pageNo, userDetailsId, filters.providerId, filters.status]);

  function onSubmit(values: z.infer<typeof vaccineSearchParams>) {
    setFilters({
      providerId: values.providerId === "all" ? "" : values.providerId || "",
      status: values.status === "all" ? "" : values.status || "",
    });
    setPageNo(1);
  }

  // Effects
  useEffect(() => {
    fetchVaccineOrderData();
  }, [fetchVaccineOrderData]);

  return (
    <div className="flex flex-col gap-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-row gap-2"
        >
          {/* Ordered By Filter */}
          <FormField
            control={form.control}
            name="providerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ordered By</FormLabel>
                <FormControl>
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by Ordered by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="cursor-pointer">
                        All
                      </SelectItem>
                      {providersList
                        .filter(
                          (
                            provider
                          ): provider is typeof provider & {
                            providerDetails: { id: string };
                          } => Boolean(provider?.providerDetails?.id)
                        )
                        .map((provider) => (
                          <SelectItem
                            key={provider.id}
                            value={provider.providerDetails.id}
                            className="cursor-pointer"
                          >
                            {provider.firstName} {provider.lastName}
                          </SelectItem>
                        ))}
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
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="cursor-pointer">
                        All
                      </SelectItem>
                      {Array.from(
                        new Set(vaccinesData?.map((vaccine) => vaccine?.status))
                      ).map((status) => (
                        <SelectItem
                          key={status}
                          value={status}
                          className="cursor-pointer"
                        >
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <div className="flex items-end">
            <Button variant={"secondary"}>Search</Button>
          </div>
        </form>
      </Form>
      <>
        {loading ? (
          <TableShimmer />
        ) : (
          <DefaultDataTable
            title={"Vaccine Order"}
            onAddClick={() => {
              setIsVaccineDialogOpen(true);
            }}
            columns={columns({
              setLoading,
              showToast: () =>
                showToast({
                  toast,
                  type: "success",
                  message: "Deleted Successfully",
                }),
              fetchVaccineOrderData: () => fetchVaccineOrderData(),
            })}
            data={vaccinesData}
            pageNo={pageNo}
            totalPages={totalPages}
            onPageChange={(newPage) => setPageNo(newPage)}
          />
        )}
      </>
      <VaccineOrders
        onClose={() => {
          setIsVaccineDialogOpen(false);
          fetchVaccineOrderData();
        }}
        isOpen={isVaccineDialogOpen}
      />
    </div>
  );
}

export default ViewVaccineOrders;
