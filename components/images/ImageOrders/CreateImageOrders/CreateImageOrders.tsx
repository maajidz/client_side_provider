"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import formStyles from "@/components/formStyles.module.css";
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
import { fetchUserDataResponse } from "@/services/userServices";
import { UserData } from "@/types/userInterface";
import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";
import { fetchProviderListDetails } from "@/services/registerServices";
import { FetchProviderListInterface } from "@/types/providerDetailsInterface";
import { ImageOrdersInterface, ImagesTestData } from "@/types/chartsInterface";
import { useToast } from "@/hooks/use-toast";
import {
  createImageOrder,
  getImagesTestsData,
} from "@/services/chartsServices";
import { showToast } from "@/utils/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelectCheckbox, Option } from "@/components/ui/multiselectDropdown";

const CreateImageResults = () => {
  const [providerListData, setProviderListData] =
    useState<FetchProviderListInterface>({
      data: [],
      total: 0,
    });
  const [imageTests, setImageTests] = useState<ImagesTestData[]>([]);
  const [patients, setPatients] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleSearchList, setVisibleSearchList] = useState<boolean>(false);
  const [loading, setLoading] = useState({
    image: false,
    provider: false,
    patient: false,
  });
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

  const fetchPatientList = useCallback(async () => {
    setLoading((prev) => ({ ...prev, patient: true }));
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
      setLoading((prev) => ({ ...prev, patient: false }));
    }
  }, [searchTerm]);

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

  useEffect(() => {
    fetchPatientList();
    fetchProvidersList();
    fetchImageTests();
  }, [searchTerm, fetchPatientList, fetchProvidersList, fetchImageTests]);

  const filteredPatients = patients.filter((patient) =>
    `${patient.user.firstName} ${patient.user.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Prepare options for MultiSelectCheckbox
  const testOptions: Option[] = imageTests.map((test) => ({
    id: test.id,
    label: test.name,
  }));

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
      router.replace(`/dashboard/provider/images`);
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

  // Function to check if all required fields are filled
  const isFormValid = () => {
    const values = form.getValues();
    const hasPatient = !!values.patient;
    const hasOrderedBy = !!values.orderedBy;
    const hasOrderedDate = !!values.orderedDate;
    const hasImageTypeId = !!values.imageTypeId;
    const hasImageTestIds = values.imageTestIds.length > 0;

    return hasPatient && hasOrderedBy && hasOrderedDate && hasImageTypeId && hasImageTestIds;
  };

  // Effect to re-evaluate form validity on changes
  useEffect(() => {
    const subscription = form.watch(() => {
      // Trigger a re-render when form values change
      setIsSubmitDisabled(!isFormValid());
    });

    return () => subscription.unsubscribe();
  }, [form]);

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(!isFormValid());

  if (loading.image || loading.patient || loading.provider) {
    return <LoadingButton />;
  }

  return (
    <>
      <div>
        <div className="flex justify-between">
          <h2>Add Image Orders</h2>
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
            <div className="flex flex-row gap-4">
              <FormField
                control={form.control}
                name="patient"
                render={({ field }) => (
                  <FormItem className={formStyles.formItem}>
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
                  <FormItem className={formStyles.formItem}>
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
                              if (imageTest.imageType) {
                                return (
                                  <SelectItem
                                    key={imageTest.id}
                                    value={imageTest.imageType.id}
                                  >{`${imageTest.imageType.name}`}</SelectItem>
                                );
                              }
                              return null;
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
                      <MultiSelectCheckbox
                        options={testOptions}
                        onChange={(selectedOptions) => {
                          form.setValue("imageTestIds", selectedOptions);
                        }}
                        defaultSelected={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <SubmitButton
                label="Submit"
                disabled={isSubmitDisabled}
                onClick={() => {
                  form.handleSubmit(onSubmit);
                }}
              />
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default CreateImageResults;
