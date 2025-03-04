"use client";

import { useCallback, useEffect, useState } from "react";
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
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import { createImageOrderSchema } from "@/schema/imagesFormSchema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import LoadingButton from "@/components/LoadingButton";
import { Separator } from "@/components/ui/separator";
import AddImagesDrawer from "@/components/charts/Encounters/SOAP/Images/AddImagesDrawer";
import PastImageOrders from "@/components/charts/Encounters/SOAP/Images/PastImageOrders";
import { fetchUserDataResponse } from "@/services/userServices";
import { UserData } from "@/types/userInterface";
import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";

const CreateImageResults = () => {
  const [patients, setPatients] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleSearchList, setVisibleSearchList] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof createImageOrderSchema>>({
    resolver: zodResolver(createImageOrderSchema),
    defaultValues: {
      patient: "",
      orderedBy: "",
      orderedDate: "",
      imageTypeId: "",
      imageTestIds: [],
    },
  });

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

  const onSubmit = async (values: z.infer<typeof createImageOrderSchema>) => {
    console.log(values);
  };

  if (loading) {
    return <LoadingButton />;
  }

  return (
    <>
      <div>
        <div className="flex justify-between">
          Add Image Orders
          <div className="flex gap-3">
            <Button
              variant={"outline"}
              className="border border-[#84012A] text-[#84012A]"
              onClick={() => {
                form.reset();
                router.replace("/dashboard/provider/images");
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
                name="orderedDate"
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
        <div className="flex h-5 items-center py-5 text-sm">
          <AddImagesDrawer userDetailsId="97f41397-3fe3-4f0b-a242-d3370063db33" />
          <Separator orientation="vertical" />
          <PastImageOrders userDetailsId="97f41397-3fe3-4f0b-a242-d3370063db33" />
        </div>
      </div>
    </>
  );
};

export default CreateImageResults;
