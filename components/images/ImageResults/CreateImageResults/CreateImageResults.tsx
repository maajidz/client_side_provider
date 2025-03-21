"use client";

import React, { useState, useCallback, useEffect } from "react";
import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";

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
import { getImagesTestsData } from "@/services/chartsServices";
import {
  ImagesTestsResponseInterface,
  TestInterface,
} from "@/types/chartsInterface";
import { createImageResultsSchema } from "@/schema/createImageResultsSchema";
import ImageFileUploader from "./ImageFileUploader";
import { TestsField } from "./TestsField";
import CreateImageResultHeader from "./CreateImageResultHeader";
import { createImageResultRequest } from "@/services/imageResultServices";
import { CreateImageResultInterface } from "@/types/imageResults";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { showToast } from "@/utils/utils";
import { useToast } from "@/hooks/use-toast";
import { UserData } from "@/types/userInterface";
import { fetchUserDataResponse } from "@/services/userServices";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface TestUploadMap {
  [testId: string]: string[];
}

const CreateImageResults = () => {
  // Track uploads per test
  const [uploadedImagesMap, setUploadedImagesMap] = useState<TestUploadMap>({});
  const [patients, setPatients] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleSearchList, setVisibleSearchList] = useState<boolean>(false);
  const [selectedTests, setSelectedTests] = useState<TestInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [imageTestResponse, setImageTestResponse] =
    useState<ImagesTestsResponseInterface>();
  const providerDetails = useSelector((state: RootState) => state.login);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof createImageResultsSchema>>({
    resolver: zodResolver(createImageResultsSchema),
    defaultValues: {
      patient: "",
      testResults: [
        {
          interpretation: "",
        },
      ],
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

  const handleUploadComplete = (images: string[], testId: string) => {
    setUploadedImagesMap((prev) => ({
      ...prev,
      [testId]: [...(prev[testId] || []), ...images],
    }));
    console.log(`Received images for test ${testId}:`, images);
  };

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
    fetchPatientList();
    fetchImageTestsData();
  }, [fetchImageTestsData, searchTerm, fetchPatientList]);

  // Ensure form has enough test result fields for each selected test
  useEffect(() => {
    const currentValues = form.getValues().testResults || [];
    if (selectedTests.length > currentValues.length) {
      // Add more test result fields if needed
      const newTestResults = [...currentValues];
      for (let i = currentValues.length; i < selectedTests.length; i++) {
        newTestResults.push({ interpretation: "" });
      }
      form.setValue("testResults", newTestResults);
    }
  }, [selectedTests, form]);

  const filteredPatients = patients.filter((patient) =>
    `${patient.user.firstName} ${patient.user.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const onSubmit = async (values: z.infer<typeof createImageResultsSchema>) => {
    console.log("values", values);
    try {
      const requestData: CreateImageResultInterface = {
        userDetailsId: values.patient,
        reviewerId: providerDetails.providerId,
        testResults: selectedTests.map((test, index) => ({
          imageTestId: test.id,
          interpretation: values.testResults[index]?.interpretation || "",
          documents: uploadedImagesMap[test.id] || [],
        })),
      };

      const response = await createImageResultRequest({ requestData });
      if (response) {
        showToast({
          toast,
          type: "success",
          message: "Added image result successfully",
        });
        setUploadedImagesMap({});
        form.reset();
        router.push("/dashboard/provider/images");
      }
    } catch (e) {
      console.log("Error", e);
      showToast({
        toast,
        type: "error",
        message: "Error while adding image results!",
      });
    }
  };

  const isSubmitDisabled = () => {
    const patientSelected = form.getValues().patient;
    const testSelected = selectedTests.length > 0;
    const interpretationEntered = selectedTests.some((test, index) => {
      const interpretation =
        form.getValues().testResults[index]?.interpretation;
      return (
        interpretation ||
        (uploadedImagesMap[test.id] && uploadedImagesMap[test.id].length > 0)
      );
    });
    return !(patientSelected && testSelected && interpretationEntered);
  };

  return (
    <>
      <div className="space-y-4">
        <CreateImageResultHeader form={form} />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="patient"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="flex gap-2 border pr-2 rounded-md items-baseline">
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
                            className="border-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 "
                          />
                        </div>
                        {searchTerm && visibleSearchList && (
                          <div className="absolute bg-white border border-gray-300 mt-1 rounded shadow-lg z-[100] w-full">
                            {loading ? (
                              <div>Loading...</div>
                            ) : filteredPatients.length > 0 ? (
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
                                  {`${patient.user.firstName} ${patient.user.lastName} - ${patient.patientId}`}
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
              {form.getValues().patient && imageTestResponse?.data && (
                <TestsField
                  form={form}
                  selectedTests={selectedTests}
                  setSelectedTests={setSelectedTests}
                  tests={imageTestResponse?.data}
                />
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              {selectedTests.map((test, index) => (
                <Card className="w-full sm:w-1/2 lg:w-1/3" key={index}>
                  <CardHeader>
                    <CardTitle>{`${test.name}`}</CardTitle>
                  </CardHeader>
                  <CardContent className="w-full">
                    <div key={test.id} className="flex gap-4 w-full flex-col">
                      <ImageFileUploader
                        onUploadComplete={(images) =>
                          handleUploadComplete(images, test.id)
                        }
                        userDetailsId={form.getValues().patient}
                        testId={test.id}
                      />
                      <FormField
                        control={form.control}
                        name={`testResults.${index}.interpretation`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">
                              Interpretation
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter interpretation for this test"
                                className="min-h-[80px]"
                                value={
                                  typeof field.value === "string"
                                    ? field.value
                                    : ""
                                }
                                onChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <SubmitButton label="Submit" disabled={isSubmitDisabled()} />
          </form>
        </Form>
      </div>
    </>
  );
};

export default CreateImageResults;
