import SubmitButton from "@/components/custom_buttons/SubmitButton";
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
import { toast } from "@/components/ui/use-toast";
import { vaccineSearchParams } from "@/schema/injectionsAndVaccinesSchema";
import { fetchProviderListDetails } from "@/services/registerServices";
import { VaccinesInterface } from "@/types/injectionsInterface";
import { FetchProviderList } from "@/types/providerDetailsInterface";
import { showToast } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export interface FilterVaccineOrdersProps {
  vaccinesData: VaccinesInterface[];
  onHandleSearch: (values: z.infer<typeof vaccineSearchParams>) => void;
}

function FilterVaccineOrders({
  vaccinesData,
  onHandleSearch,
}: FilterVaccineOrdersProps) {
  // Data State
  const [providersList, setProvidersList] = useState<FetchProviderList[]>([]);

  // Loading State
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof vaccineSearchParams>>({
    resolver: zodResolver(vaccineSearchParams),
  });

  // Fetch Providers Data
  const fetchProvidersData = useCallback(async () => {
    setLoading(true);

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
    } finally {
      setLoading(false);
    }
  }, []);

  // Effects
  useEffect(() => {
    fetchProvidersData();
  }, [fetchProvidersData]);

  if(loading) return <LoadingButton />;

  function onSubmit(values: z.infer<typeof vaccineSearchParams>) {
    onHandleSearch(values);
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4"
        >
          {/* Ordered By Filter */}
          <FormField
            control={form.control}
            name="providerId"
            render={({ field }) => (
              <FormItem className="flex items-center">
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
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
              <FormItem className="flex items-center">
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
            <SubmitButton label="Search" />
          </div>
        </form>
      </Form>
    </>
  );
}

export default FilterVaccineOrders;
