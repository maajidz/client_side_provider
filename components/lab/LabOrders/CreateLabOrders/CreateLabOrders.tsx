"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createLabResultsSchema } from "@/schema/createLabResultsSchema";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import LoadingButton from "@/components/LoadingButton";
import SearchAndAddDrawer from "@/components/charts/Encounters/SOAP/Labs/SearchAndAddDrawer";
import { Separator } from "@/components/ui/separator";
import AddLabsDialog from "@/components/charts/Encounters/SOAP/Labs/AddLabsDialog";
import PastOrdersDialog from "@/components/charts/Encounters/SOAP/Labs/PastOrdersDialog";
import ViewOrdersDialog from "@/components/charts/Encounters/SOAP/Labs/ViewOrdersDialog";
import { fetchUserDataResponse } from "@/services/userServices";
import { UserData } from "@/types/userInterface";
import SubmitButton from "@/components/custom_buttons/SubmitButton";

const CreateLabResults = () => {
  const form = useForm<z.infer<typeof createLabResultsSchema>>({
    resolver: zodResolver(createLabResultsSchema),
    defaultValues: {
      patient: "",
      reviewer: "",
      dateTime: "",
      labId: "",
      testIds: [],
      testResults: [
        {
          name: "",
          result: "",
          unit: "",
          referenceMin: undefined,
          referenceMax: undefined,
          interpretation: "",
          comment: "",
          groupComment: "",
        },
      ],
      tags: "",
    },
  });

  const [patients, setPatients] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleSearchList, setVisibleSearchList] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const fetchPatientList = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchUserDataResponse({
        pageNo: 1,
        pageSize: 10,
        firstName: searchTerm,
        lastName: searchTerm,
      });
      if (response) {
        setPatients(response.data);
      }
    } catch (e) {
      console.log("Error", e);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchPatientList();
  }, [searchTerm, fetchPatientList]);

  const filteredPatients = patients.filter((patient) =>
    `${patient.user.firstName} ${patient.user.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const onSubmit = async (values: z.infer<typeof createLabResultsSchema>) => {
    console.log(values);
  };

  if (loading) {
    return <LoadingButton />;
  }

  return (
    <>
      <div>
        <div className="flex justify-between">
          Add Lab Orders
          <div className="flex gap-3">
            <Button
              variant={"outline"}
              className="border border-[#84012A] text-[#84012A]"
              onClick={() => {
                form.reset();
                router.replace("/dashboard/provider/labs");
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="flex gap-7">
              <FormField
                control={form.control}
                name="patient"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Search Patient "
                          value={searchTerm}
                          onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setVisibleSearchList(true);
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
              <FormField
                control={form.control}
                name="dateTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ordered Data</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        placeholder="Select date"
                        className="w-fit"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <SubmitButton label="Submit" />
            </div>
          </form>
        </Form>
        <div className="flex py-5 items-center space-x-4 text-sm">
          <SearchAndAddDrawer userDetailsId={""} />
          <Separator orientation="vertical" />
          <AddLabsDialog userDetailsId={""} />
          <Separator orientation="vertical" />
          <PastOrdersDialog userDetailsId={""} />
          <Separator orientation="vertical" />
          <ViewOrdersDialog userDetailsId={""} />
        </div>
      </div>
    </>
  );
};

export default CreateLabResults;
