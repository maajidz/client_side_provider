"use client";

import { Button } from "@/components/ui/button";
import { DocumentsInterface } from "@/types/documentsInterface";
import { FetchProviderList } from "@/types/providerDetailsInterface";
import { UserData } from "@/types/userInterface";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { searchParamsForDocumentsSchema } from "@/schema/documentsSchema";

interface FilterDocumentsProps {
  documentsData: DocumentsInterface[];
  userInfo: UserData[];
  providersData: FetchProviderList[];
  onSearch: (data: z.infer<typeof searchParamsForDocumentsSchema>) => void;
}

function FilterDocuments({
  documentsData,
  userInfo,
  providersData,
  onSearch,
}: FilterDocumentsProps) {
  const form = useForm<z.infer<typeof searchParamsForDocumentsSchema>>({
    resolver: zodResolver(searchParamsForDocumentsSchema),
    defaultValues: {
      patient: "",
      reviewer: "",
      status: "",
    },
  });

  const handleSearch = (
    data: z.infer<typeof searchParamsForDocumentsSchema>
  ) => {
    onSearch(data);
  };

  return (
    <div className="flex flex-wrap">
      <Form {...form}>
        <form
          className="flex flex-wrap justify-center items-center gap-4"
          onSubmit={form.handleSubmit(handleSearch)}
        >
          {/* Reviewer Filter */}
          <FormField
            control={form.control}
            name="reviewer"
            render={({ field }) => (
              <div className="w-full sm:w-[250px] md:w-[300px] lg:w-[350px]">
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Reviewer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="cursor-pointer">
                      All
                    </SelectItem>
                    {providersData
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
              </div>
            )}
          />

          {/* Patient Filter */}
          <FormField
            control={form.control}
            name="patient"
            render={({ field }) => (
              <div className="w-full sm:w-[250px] md:w-[300px] lg:w-[350px]">
                <FormItem className="flex gap-2 justify-center items-center w-full">
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by Patient" />
                      </SelectTrigger>
                      <SelectContent>
                        {userInfo
                          .filter((user) => user?.user?.userDetailsId)
                          .map((user) => (
                            <SelectItem
                              key={user.id}
                              value={user.user.userDetailsId!}
                              className="cursor-pointer"
                            >
                              {user.user.firstName} {user.user.lastName}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              </div>
            )}
          />

          {/* Status Filter */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <div className="w-full sm:w-[250px] md:w-[300px] lg:w-[350px]">
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="cursor-pointer">
                      All
                    </SelectItem>
                    {documentsData.map((document) => (
                      <SelectItem
                        key={document.id}
                        value={document.status}
                        className="cursor-pointer"
                      >
                        {document.status.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          />

          {/* Search Button */}
          <div className="flex justify-center items-center w-full sm:w-auto">
            <Button
              type="submit"
              className="p-3 bg-[#84012A] text-white rounded-md hover:bg-[#6C011F] focus:outline-none focus:ring-2 focus:ring-[#6C011F]"
            >
              Search
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default FilterDocuments;
