import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { vaccineSearchParams } from "@/schema/injectionsAndVaccinesSchema";
import { VaccinesInterface } from "@/types/injectionsInterface";
import { FetchProviderList } from "@/types/providerDetailsInterface";
import { UserData } from "@/types/userInterface";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export interface FilterVaccinesProps {
  providerList: FetchProviderList[];
  filteredPatients: UserData[];
  searchTerm: string;
  vaccinesData: VaccinesInterface[];
  visibleSearchList: boolean;
  onHandleSearch: (values: z.infer<typeof vaccineSearchParams>) => void;
  onSetSearchTerm: (value: string) => void;
  onSetVisibleSearchList: (value: boolean) => void;
}

function FilterVaccines({
  filteredPatients,
  providerList,
  searchTerm,
  vaccinesData,
  visibleSearchList,
  onHandleSearch,
  onSetSearchTerm,
  onSetVisibleSearchList,
}: FilterVaccinesProps) {
  const form = useForm<z.infer<typeof vaccineSearchParams>>({
    resolver: zodResolver(vaccineSearchParams),
  });

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
                      {providerList
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

          {/* Patient Filter */}
          <FormField
            control={form.control}
            name="userDetailsId"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Search Patient "
                      value={searchTerm}
                      onChange={(e) => {
                        const value = e.target.value;
                        onSetSearchTerm(value);
                        onSetVisibleSearchList(true);

                        if (!value) {
                          field.onChange("");
                        }
                      }}
                    />
                    {searchTerm && visibleSearchList && (
                      <div className="absolute bg-white border border-gray-300 mt-1 rounded shadow-lg  w-full">
                        {filteredPatients.length > 0 ? (
                          filteredPatients.map((patient) => (
                            <div
                              key={patient.id}
                              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                              onClick={() => {
                                field.onChange(patient.id);
                                onSetSearchTerm(
                                  `${patient.user.firstName} ${patient.user.lastName}`
                                );
                                onSetVisibleSearchList(false);
                              }}
                            >
                              {`${patient.user.firstName} ${patient.user.lastName}`}
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-gray-500">
                            No results found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-end">
            <Button type="submit">Search</Button>
          </div>
        </form>
      </Form>
    </>
  );
}

export default FilterVaccines;

