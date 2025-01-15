"use client";

import { DocumentsInterface } from "@/types/documentsInterface";
import { UserData } from "@/types/userInterface";
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

interface FilterDocumentsProps {
  documentsData: DocumentsInterface[];
  userInfo: UserData[];
  onFilterChange: (filters: {
    reviewer: string;
    status: string;
    patient: string;
  }) => void;
}

function FilterDocuments({
  documentsData,
  userInfo,
  onFilterChange,
}: FilterDocumentsProps) {
  const form = useForm();

  const handleReviewerChange = (value: string) => {
    onFilterChange({
      reviewer: value,
      status: form.getValues("status"),
      patient: form.getValues("patient"),
    });
  };

  const handleStatusChange = (value: string) => {
    onFilterChange({
      reviewer: form.getValues("reviewer"),
      status: value,
      patient: form.getValues("patient"),
    });
  };

  const handlePatientChange = (value: string) => {
    onFilterChange({
      reviewer: form.getValues("reviewer"),
      status: form.getValues("status"),
      patient: value,
    });
  };

  return (
    <div className="flex gap-4 flex-wrap">
      <Form {...form}>
        <form className="flex gap-4 flex-wrap">
          {/* Reviewer Filter */}
          <Select onValueChange={handleReviewerChange}>
            <SelectTrigger className="w-full sm:w-[250px] md:w-[300px] lg:w-[350px] p-3 border-2 border-gray-200 rounded-md text-gray-500">
              <SelectValue placeholder="Filter by Reviewer" />
            </SelectTrigger>
            <SelectContent className="bg-[#eaeaeb] rounded-md shadow-lg mt-1 border border-gray-300">
              <SelectItem value="all">All</SelectItem>
              {/* {documentsData
                .filter((document) => document?.reviewerId)
                .map((user) => (
                  <SelectItem key={user.id} value={user.reviewerId}>
                    {user?.reviewerId}
                  </SelectItem>
                ))} */}
            </SelectContent>
          </Select>

          {/* Patient Filter */}
          <FormField
            control={form.control}
            name="patient"
            render={({}) => (
              <FormItem className="flex justify-center items-center w-1/3">
                <FormControl>
                  <Select onValueChange={handlePatientChange}>
                    <SelectTrigger className="w-full sm:w-[250px] md:w-[300px] lg:w-[350px] p-3 border-2 border-gray-200 rounded-md text-gray-500">
                      <SelectValue placeholder="Filter by Patient" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#eaeaeb] rounded-md shadow-lg mt-1 border border-gray-300">
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
            )}
          />

          {/* Status Filter */}
          <Select onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full sm:w-[250px] md:w-[300px] lg:w-[350px] p-3 border-2 border-gray-200 rounded-md text-gray-500">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent className="bg-[#eaeaeb] rounded-md shadow-lg mt-1 border border-gray-300">
              <SelectItem value="all">All</SelectItem>
              {documentsData.map((document) => (
                <SelectItem key={document.id} value={document.status}>
                  {document.status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </form>
      </Form>
    </div>
  );
}

export default FilterDocuments;
