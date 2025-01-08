"use client";

import React, { useState, useCallback, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import {
  FieldValues,
  useFieldArray,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { z } from "zod";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { getImagesData, getImagesTestsData } from "@/services/chartsServices";
import {
  ImagesResponseInterface,
  ImagesTestData,
  ImagesTestsResponseInterface,
} from "@/types/chartsInterface";
import LoadingButton from "@/components/LoadingButton";
import { fetchProviderListDetails } from "@/services/registerServices";
import { FetchProviderListInterface } from "@/types/providerDetailsInterface";
import { createImageResultsSchema } from "@/schema/createImageResultsSchema";

const CreateImageResults = () => {
  const [patients] = useState([
    "John Doe",
    "Jane Smith",
    "Emily Davis",
    "David Johnson",
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleSearchList, setVisibleSearchList] = useState<boolean>(false);
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [imageResponse, setImageResponse] = useState<ImagesResponseInterface>({
    data: [],
    total: 0,
  });
  const [imageTestResponse, setImageTestResponse] =
    useState<ImagesTestsResponseInterface>();
  const [providerListData, setProviderListData] =
    useState<FetchProviderListInterface>({
      data: [],
      total: 0,
    });
  //   const [selectedImage, setSelectedImage] = useState<string>("");
  const router = useRouter();

  const form = useForm<z.infer<typeof createImageResultsSchema>>({
    resolver: zodResolver(createImageResultsSchema),
    defaultValues: {
      patient: "",
      reviewer: "",
      dateTime: "",
      imageId: "",
      testIds: [],
      testResults: [
        {
          interpretation: "",
        },
      ],
    },
  });

  const { fields: testGroupFields } = useFieldArray({
    control: form.control,
    name: "testResults",
  });

  const fetchImagesData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getImagesData({ page: 1, limit: 10 });
      if (data) {
        setImageResponse(() => ({
          data: data.data,
          total: data.total,
        }));
        setLoading(false);
      }
    } catch (e) {
      console.log("Error", e);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProvidersList = useCallback(async () => {
    setLoading(true);
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
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchImageTestsData = useCallback(async () => {
    setLoading(true);
    try {
      const responseData = await getImagesTestsData({ limit: 10, page: 1 });
      if (responseData) {
        setImageTestResponse(responseData);
      }
    } catch (e) {
      console.log("Error", e);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProvidersList();
    fetchImagesData();
    fetchImageTestsData();
  }, [fetchImagesData, fetchImageTestsData, fetchProvidersList]);

  //   useEffect(() => {
  //     if (selectedImage) {
  //       fetchImageTestsData();
  //     }
  //   }, [selectedImage, fetchImageTestsData]);

  const filteredPatients = patients.filter((patient) =>
    patient.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = async (values: z.infer<typeof createImageResultsSchema>) => {
    console.log(values);
    // const requestData = {
    //   userDetailsId: "97f41397-3fe3-4f0b-a242-d3370063db33",
    //   reviewerId: values.reviewer,
    //   dateTime: values.dateTime,
    //   imageId: values.imageId,
    //   testIds: values.testIds,
    //   testResults: values.testResults.map((result) => ({
    //     interpretation: result.interpretation || ""
    //   })),
    // };
    // try {
    //   const response = await createLabResultRequest({ requestData });
    //   if (response) {
    //     showToast({
    //       toast,
    //       type: "success",
    //       message: "Lab Result saved sucessfully!",
    //     });
    //     router.replace('/dashboard/labs')
    //   }
    // } catch (e) {
    //   console.log("Error", e);
    //   showToast({
    //     toast,
    //     type: "error",
    //     message: "Error while saving Lab Results",
    //   });
    // }
  };

  if (loading) {
    return <LoadingButton />;
  }

  return (
    <>
      <div>
        <div className="flex justify-between">
          Add Image Results
          <div className="flex gap-3">
            <Button
              variant={"outline"}
              className="border border-[#84012A] text-[#84012A]"
              onClick={() => {
                form.reset();
                router.replace("/dashboard/images");
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
                              filteredPatients.map((patient, index) => (
                                <div
                                  key={index}
                                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                  onClick={() => {
                                    setSearchTerm(patient);
                                    field.onChange(patient);
                                    setVisibleSearchList(false);
                                  }}
                                >
                                  {patient}
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
                name="reviewer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="">Reviewer:</FormLabel>
                    <FormControl>
                      <div className="flex flex-col gap-2 items-start justify-start ">
                        <Select
                          value={field.value}
                          onValueChange={(value: string) => {
                            field.onChange(value);
                          }}
                        >
                          <SelectTrigger className="w-64">
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
                name="dateTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date and Time</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        {...field}
                        placeholder="Select date and time"
                        className="w-fit"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="imageId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image Name</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value: string) => {
                        field.onChange(value);
                        // setSelectedImage(value);
                      }}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select an image" />
                      </SelectTrigger>
                      <SelectContent>
                        {imageResponse &&
                          imageResponse.data &&
                          imageResponse.data.length > 0 &&
                          imageResponse.data.map((image) => (
                            <SelectItem key={image.id} value={image.id}>
                              {image.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {imageTestResponse?.data && (
              <TestsField
                form={form}
                selectedTests={selectedTests}
                setSelectedTests={setSelectedTests}
                tests={imageTestResponse?.data}
              />
            )}
            {selectedTests.length > 0 && (
              <div className="test-groups">
                {selectedTests.map((test, index) => (
                  <div key={index}>
                    <h3 className="text-lg font-semibold">{`Test Results for ${test}`}</h3>
                    {testGroupFields.map((group, groupIndex) => (
                      <div
                        key={`${group.id}-${groupIndex}`}
                        className="border border-gray-300 rounded-lg p-4 mb-4"
                      >
                        <FormField
                          control={form.control}
                          name={`testResults.${groupIndex}.interpretation`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Interpretation</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Interpretation"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </>
  );
};

export default CreateImageResults;

export function DropdownMenuCheckboxesField({
  field,
  selectedTests,
  setSelectedTests,
  tests,
}: {
  field: FieldValues;
  selectedTests: string[];
  setSelectedTests: React.Dispatch<React.SetStateAction<string[]>>;
  tests: ImagesTestData[];
}) {
  const handleTestChange = (value: string, checked: boolean) => {
    if (checked) {
      const updatedTests = [...selectedTests, value];
      setSelectedTests(updatedTests);
      field.onChange(updatedTests);
    } else {
      const updatedTests = selectedTests.filter((test) => test !== value);
      setSelectedTests(updatedTests);
      field.onChange(updatedTests);
    }
  };

  return (
    <FormItem>
      <FormLabel>Tests</FormLabel>
      <FormControl>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {selectedTests.length > 0
                ? `${selectedTests.join(", ")}`
                : "Select tests"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Select Tests</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {tests.map((test) => (
              <DropdownMenuCheckboxItem
                key={test.id}
                checked={selectedTests.includes(test.id)}
                onCheckedChange={(checked) =>
                  handleTestChange(test.id, checked)
                }
              >
                {test.name}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}

function TestsField({
  form,
  selectedTests,
  setSelectedTests,
  tests,
}: {
  form: UseFormReturn<z.infer<typeof createImageResultsSchema>>;
  selectedTests: string[];
  setSelectedTests: React.Dispatch<React.SetStateAction<string[]>>;
  tests: ImagesTestData[];
}) {
  return (
    <FormField
      control={form.control}
      name="testIds"
      render={({ field }) => (
        <DropdownMenuCheckboxesField
          field={field}
          selectedTests={selectedTests}
          setSelectedTests={setSelectedTests}
          tests={tests}
        />
      )}
    />
  );
}
