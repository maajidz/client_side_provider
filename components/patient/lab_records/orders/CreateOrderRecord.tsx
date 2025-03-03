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
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import LoadingButton from "@/components/LoadingButton";
import SearchAndAddDrawer from "@/components/charts/Encounters/SOAP/Labs/SearchAndAddDrawer";
import { Separator } from "@/components/ui/separator";
import AddLabsDialog from "@/components/charts/Encounters/SOAP/Labs/AddLabsDialog";
import PastOrdersDialog from "@/components/charts/Encounters/SOAP/Labs/PastOrdersDialog";
import ViewOrdersDialog from "@/components/charts/Encounters/SOAP/Labs/ViewOrdersDialog";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";
import formStyles from "@/components/formStyles.module.css";
import { createLabOrdersSchema } from "@/schema/createLabOrderSchema";
import { FetchProviderListInterface } from "@/types/providerDetailsInterface";
import { fetchProviderListDetails } from "@/services/registerServices";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LabOrdersInterface, LabsDataResponse } from "@/types/chartsInterface";
import { getLabsData } from "@/services/chartsServices";
import { showToast } from "@/utils/utils";
import { useToast } from "@/hooks/use-toast";
import { createLabOrders } from "@/services/labOrdersService";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const CreateOrderRecord = () => {
  // Labs Data
  const [labResponse, setLabResponse] = useState<LabsDataResponse>({
    data: [],
    total: 0,
  });

  // Providers List
  const [providerListData, setProviderListData] =
    useState<FetchProviderListInterface>({
      data: [],
      total: 0,
    });

  // Loading State
  const [loading, setLoading] = useState({
    patient: false,
    patients: false,
  });

  // Toast State
  const { toast } = useToast();

  // Router Hook
  const router = useRouter();

  // User Details ID extracted from query parameters
  const params = useParams();
  const userDetailsId = Array.isArray(params.userDetailsId)
    ? params.userDetailsId[0]
    : params.userDetailsId;

  // Labs list
  const fetchLabsData = useCallback(async () => {
    setLoading((prev) => ({ ...prev, lab: true }));

    try {
      const data = await getLabsData({ page: 1, limit: 10 });
      if (data) {
        setLabResponse(() => ({
          data: data.data,
          total: data.total,
        }));
        if (labResponse.total < data.total) {
          await fetchLabsData();
        }
      }
    } catch (e) {
      console.log("Error", e);
    } finally {
      setLoading((prev) => ({ ...prev, lab: false }));
    }
  }, [labResponse?.total]);

  const form = useForm<z.infer<typeof createLabOrdersSchema>>({
    resolver: zodResolver(createLabOrdersSchema),
    defaultValues: {
      orderedBy: "",
      date: "",
      labs: [],
      tests: [],
      isSigned: false,
    },
  });

  const fetchProvidersList = useCallback(async () => {
    setLoading((prev) => ({ ...prev, provider: true }));
    try {
      const data = await fetchProviderListDetails({ page: 1, limit: 10 });
      if (data) {
        setProviderListData(() => ({
          data: data.data,
          total: data.total,
        }));
      }
    } catch (e) {
      console.log("Error", e);
    } finally {
      setLoading((prev) => ({ ...prev, provider: false }));
    }
  }, []);

  useEffect(() => {
    fetchLabsData();
    fetchProvidersList();
  }, [fetchLabsData, fetchProvidersList]);

  const onSubmit = async (values: z.infer<typeof createLabOrdersSchema>) => {
    const requestData: LabOrdersInterface = {
      orderedBy: values.orderedBy,
      date: values.date,
      labs: values.labs,
      tests: values.tests,
      userDetailsId: userDetailsId ?? "",
      isSigned: false,
    };

    try {
      const response = await createLabOrders({ requestData });
      if (response) {
        showToast({
          toast,
          type: "success",
          message: "Lab Result saved successfully!",
        });
        router.replace(
          `/dashboard/provider/patient/${userDetailsId}/lab_records`
        );
      }
    } catch (e) {
      console.log("Error", e);
      showToast({
        toast,
        type: "error",
        message: "Error while saving Lab Results",
      });
    } finally {
      form.reset();
    }
  };

  if (loading.patient || loading.patients) {
    return <LoadingButton />;
  }

  return (
    <>
      <div>
        <div className="flex justify-between">
          Add Lab Orders
          <div className="flex gap-3 ">
            <Button
              variant={"outline"}
              className="border border-[#84012A] text-[#84012A]"
              onClick={() => {
                form.reset();
                router.replace(
                  `/dashboard/provider/patient/${userDetailsId}/lab_records`
                );
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className={`${formStyles.formBody} w-[30rem]`}>
              <FormField
                control={form.control}
                name="orderedBy"
                render={({ field }) => (
                  <FormItem className={formStyles.formItem}>
                    <FormLabel>Ordered By:</FormLabel>
                    <FormControl>
                      <div className="flex flex-col gap-2 items-start justify-start ">
                        <Select
                          value={field.value}
                          onValueChange={(value: string) => {
                            field.onChange(value);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {providerListData.data.map((providerList) => {
                              const providerId =
                                providerList.providerDetails?.id ??
                                providerList.id;
                              return (
                                <SelectItem
                                  key={providerList.id}
                                  value={providerId}
                                >{`${providerList.firstName} ${providerList.lastName}`}</SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className={formStyles.formItem}>
                    <FormLabel>Ordered Date</FormLabel>
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
              <FormField
                control={form.control}
                name="labs"
                render={({ field }) => (
                  <FormItem className={formStyles.formItem}>
                    <FormLabel>Labs</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            className="border px-4 py-2 rounded-md w-full text-left"
                            type="button"
                          >
                            {field.value.length > 0
                              ? field.value
                                  .map(
                                    (labId) =>
                                      labResponse?.data?.find(
                                        (lab) => lab.id === labId
                                      )?.name
                                  )
                                  .join(", ")
                              : "Select labs"}
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-72 bg-white border rounded-md p-2">
                          {labResponse?.data?.map((lab) => (
                            <div
                              key={lab.id}
                              className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-100 rounded"
                              onClick={() => {
                                // Toggle lab selection
                                const updatedLabs = field.value.includes(lab.id)
                                  ? field.value.filter((id) => id !== lab.id)
                                  : [...field.value, lab.id];

                                form.setValue("labs", updatedLabs);
                              }}
                            >
                              <Checkbox
                                checked={field.value.includes(lab.id)}
                              />
                              <span>{lab.name}</span>
                            </div>
                          ))}
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tests"
                render={({ field }) => (
                  <FormItem className={formStyles.formItem}>
                    <FormLabel>Tests</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            className="border px-4 py-2 rounded-md w-full text-left"
                            type="button"
                          >
                            {field.value.length > 0
                              ? field.value
                                  .map(
                                    (testId) =>
                                      labResponse?.data
                                        ?.flatMap((lab) => lab.tests)
                                        ?.find((test) => test.id === testId)
                                        ?.name
                                  )
                                  .join(", ")
                              : "Select tests"}
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-72 bg-white border rounded-md p-2">
                          {labResponse?.data?.flatMap((lab) =>
                            lab.tests.map((test) => (
                              <div
                                key={test.id}
                                className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-100 rounded"
                                onClick={() => {
                                  // Toggle selection
                                  const updatedTests = field.value.includes(
                                    test.id
                                  )
                                    ? field.value.filter((id) => id !== test.id)
                                    : [...field.value, test.id];

                                  form.setValue("tests", updatedTests);
                                }}
                              >
                                <Checkbox
                                  checked={field.value.includes(test.id)}
                                />
                                <span>{test.name}</span>
                              </div>
                            ))
                          )}
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <SubmitButton label="Submit" />
            </div>
          </form>
        </Form>
        {userDetailsId && (
          <div className="flex py-5 items-center space-x-4 text-sm">
            <SearchAndAddDrawer userDetailsId={userDetailsId} />
            <Separator orientation="vertical" />
            <AddLabsDialog userDetailsId={userDetailsId} />
            <Separator orientation="vertical" />
            <PastOrdersDialog userDetailsId={userDetailsId} />
            <Separator orientation="vertical" />
            <ViewOrdersDialog userDetailsId={userDetailsId} />
          </div>
        )}
      </div>
    </>
  );
};

export default CreateOrderRecord;
