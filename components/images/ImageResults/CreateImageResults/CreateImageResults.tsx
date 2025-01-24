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
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getImagesTestsData } from "@/services/chartsServices";
import { ImagesTestsResponseInterface } from "@/types/chartsInterface";
import LoadingButton from "@/components/LoadingButton";
import { createImageResultsSchema } from "@/schema/createImageResultsSchema";
import UploadImageResults from "./UploadImageResults";
import { TestsField } from "./TestsField";
import CreateImageResultHeader from "./CreateImageResultHeader";
import { createImageResultRequest } from "@/services/imageResultServices";
import { CreateImageResultInterface } from "@/types/imageResults";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { showToast } from "@/utils/utils";
import { useToast } from "@/components/ui/use-toast";
import { UserData } from "@/types/userInterface";
import { fetchUserDataResponse } from "@/services/userServices";

const CreateImageResults = () => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [patients, setPatients] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleSearchList, setVisibleSearchList] = useState<boolean>(false);
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [imageTestResponse, setImageTestResponse] =
    useState<ImagesTestsResponseInterface>();
  const providerDetails = useSelector((state: RootState) => state.login);
  const { toast } = useToast();

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

  const handleUploadComplete = (images: string[]) => {
    setUploadedImages((prevImages) => [...prevImages, ...images]);
    console.log("Received images:", images);
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
        testResults: values.testResults.map((test, index) => ({
          imageTestId: selectedTests[index],
          interpretation: test.interpretation ? `${test.interpretation}` : "",
          documents: uploadedImages,
        })),
      };
      console.log("Request", requestData);
      const response = await createImageResultRequest({
        requestData: requestData,
      });
      if (response) {
        showToast({
          toast,
          type: "success",
          message: "Added image result successfully",
        });
        form.reset();
        setUploadedImages([]);
      }
    } catch (e) {
      console.log("Error", e);
      showToast({
        toast,
        type: "error",
        message: "Error while adding image results!",
      });
    } finally {
    }
  };

  if (loading) {
    return <LoadingButton />;
  }

  return (
    <>
      <div>
        <CreateImageResultHeader form={form} />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
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
            {imageTestResponse?.data && (
              <TestsField
                form={form}
                selectedTests={selectedTests}
                setSelectedTests={setSelectedTests}
                tests={imageTestResponse?.data}
              />
            )}
            {selectedTests.map((test, index) => (
              <div
                key={index}
                className="border border-gray-300 rounded-lg p-4 mb-4"
              >
                <h3 className="text-lg font-semibold">{`Test Results for ${test}`}</h3>
                <div key={test}>
                  <UploadImageResults
                    onUploadComplete={(images) => handleUploadComplete(images)}
                    userDetailsId= {form.getValues().patient}
                  />
                  {uploadedImages &&
                    uploadedImages.map((image) => (
                      <Button key={image} variant={"link"}>
                        {image}
                      </Button>
                    ))}
                  <FormField
                    control={form.control}
                    name={`testResults.${index}.interpretation`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Interpretation</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Interpretation"
                            value={
                              typeof field.value === "string" ? field.value : ""
                            }
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
            <Button
              type="submit"
              onClick={() => {
                console.log("Submit Clicked");
                console.log(form.getValues());
              }}
            >
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};

export default CreateImageResults;
