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
import { Input } from "../ui/input";
import { useState } from "react";

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
  // Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleSearchList, setVisibleSearchList] = useState<boolean>(false);

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

  const filteredPatients = userInfo.filter((user) =>
    `${user.user.firstName} ${user.user.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

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
            render={() => (
              <div>
                <FormItem className="flex gap-2 justify-center items-center w-full">
                  {/* Patient Filter */}
                  <FormField
                    control={form.control}
                    name="patient"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Search Patient "
                              value={searchTerm}
                              onChange={(e) => {
                                const value = e.target.value;
                                setSearchTerm(value);
                                setVisibleSearchList(true);

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
                                        setSearchTerm(
                                          `${patient.user.firstName} ${patient.user.lastName}`
                                        );
                                        setVisibleSearchList(false);
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
                        key={document.documentId}
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
