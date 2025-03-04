"use client";

import React, { useCallback, useEffect, useState } from "react";
import LoadingButton from "@/components/LoadingButton";
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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import AddImagesDrawer from "@/components/charts/Encounters/SOAP/Images/AddImagesDrawer";
import PastImageOrders from "@/components/charts/Encounters/SOAP/Images/PastImageOrders";
import formStyles from "@/components/formStyles.module.css";
import { createImageOrderSchema } from "@/schema/imagesFormSchema";
import { FetchProviderListInterface } from "@/types/providerDetailsInterface";
import { fetchProviderListDetails } from "@/services/registerServices";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createImageOrder,
  getImagesTestsData,
} from "@/services/chartsServices";
import { ImageOrdersInterface, ImagesTestData } from "@/types/chartsInterface";
import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { showToast } from "@/utils/utils";
import { useToast } from "@/hooks/use-toast";

const CreatePatientImageOrders = ({
  userDetailsId,
}: {
  userDetailsId: string;
}) => {
  // * Provider Data
  const [providerListData, setProviderListData] =
    useState<FetchProviderListInterface>({
      data: [],
      total: 0,
    });
  // * Image Tests Data
  const [imageTests, setImageTests] = useState<ImagesTestData[]>([]);
  // * Loading State
  const [loading, setLoading] = useState({
    image: false,
    provider: false,
  });
  // * Toast State
  const { toast } = useToast();

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
  if (userDetailsId) {
    form.setValue("patient", userDetailsId);
  }

  // GET Providers List
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

  // GET Image Tests
  const fetchImageTests = useCallback(async () => {
    setLoading((prev) => ({ ...prev, image: true }));

    try {
      const response = await getImagesTestsData({ limit: 15, page: 1 });

      if (response) {
        setImageTests(response.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading((prev) => ({ ...prev, image: false }));
    }
  }, []);

  const onSubmit = async (values: z.infer<typeof createImageOrderSchema>) => {
    setLoading((prev) => ({ ...prev, image: true }));

    const requestData: ImageOrdersInterface = {
      ordered_date: values.orderedDate,
      providerId: values.orderedBy,
      userDetailsId: values.patient,
      imageTypeId: values.imageTypeId,
      imageTestIds: values.imageTestIds,
      intra_office_notes: "",
      note_to_patients: "",
    };

    try {
      await createImageOrder({ requestData });

      showToast({
        toast,
        type: "success",
        message: "Image order saved successfully!",
      });
      router.replace(`/dashboard/provider/patient/${userDetailsId}/images`);
    } catch (err) {
      if (err instanceof Error) {
        showToast({
          toast,
          type: "error",
          message: "Image order could not be saved!",
        });
      }
    } finally {
      setLoading((prev) => ({ ...prev, image: false }));
    }
  };

  // Effects
  useEffect(() => {
    fetchImageTests();
    fetchProvidersList();
  }, [fetchImageTests, fetchProvidersList]);

  if (loading.image || loading.provider) {
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
                router.replace(
                  `/dashboard/provider/patient/${userDetailsId}/images`
                );
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className={formStyles.formBody}>
              {/* * Ordered Date   */}
              <FormField
                control={form.control}
                name="orderedDate"
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
              {/* Ordered By */}
              <FormField
                control={form.control}
                name="orderedBy"
                render={({ field }) => (
                  <FormItem className={formStyles.formItem}>
                    <FormLabel>Ordered By:</FormLabel>
                    <FormControl>
                      <div className="flex flex-col gap-2 items-start justify-start">
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
              {/* Image Type */}
              <FormField
                control={form.control}
                name="imageTypeId"
                render={({ field }) => (
                  <FormItem className={formStyles.formItem}>
                    <FormLabel>Image Type:</FormLabel>
                    <FormControl>
                      <div className="flex flex-col gap-2 items-start justify-start">
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
                            {imageTests.map((imageTest) => {
                              return (
                                <SelectItem
                                  key={imageTest.id}
                                  value={imageTest.imageType.id}
                                >{`${imageTest.imageType.name}`}</SelectItem>
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
              {/* Tests */}
              <FormField
                control={form.control}
                name="imageTestIds"
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
                              ? imageTests
                                  .filter((test) =>
                                    field.value.includes(test.id)
                                  )
                                  .map((test) => test.name)
                                  .join(", ")
                              : "Select tests"}
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-72 bg-white border rounded-md p-2">
                          {imageTests.map((test) => (
                            <div
                              key={test.id}
                              className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-100 rounded"
                              onClick={() => {
                                const updatedTests = field.value.includes(
                                  test.id
                                )
                                  ? field.value.filter((id) => id !== test.id)
                                  : [...field.value, test.id];

                                form.setValue("imageTestIds", updatedTests);
                              }}
                            >
                              <Checkbox
                                checked={field.value.includes(test.id)}
                              />
                              <span>{test.name}</span>
                            </div>
                          ))}
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
        <div className="flex h-5 items-center py-5 text-sm">
          <AddImagesDrawer userDetailsId={userDetailsId} />
          <Separator orientation="vertical" />
          <PastImageOrders userDetailsId={userDetailsId} />
        </div>
      </div>
    </>
  );
};

export default CreatePatientImageOrders;
