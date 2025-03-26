"use client";

import React, { useState, useCallback, useEffect } from "react";
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
import { TestsField } from "@/components/images/ImageResults/CreateImageResults/TestsField";
import CreateImageResultHeader from "@/components/images/ImageResults/CreateImageResults/CreateImageResultHeader";
import { createImageResultRequest } from "@/services/imageResultServices";
import { CreateImageResultInterface } from "@/types/imageResults";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { showToast } from "@/utils/utils";
import { useToast } from "@/hooks/use-toast";
import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";
import formStyles from "@/components/formStyles.module.css";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImageFileUploader from "@/components/images/ImageResults/CreateImageResults/ImageFileUploader";

const CreatePatientImageResults = ({
  userDetailsId,
}: {
  userDetailsId: string;
}) => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
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
      patient: userDetailsId,
      testIds: [],
      testResults: [],
    },
    mode: "onChange",
  });

  const testIds = form.watch("testIds");

  const handleUploadComplete = (images: string[]) => {
    setUploadedImages((prevImages) => [...prevImages, ...images]);
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
    fetchImageTestsData();
  }, [fetchImageTestsData]);

  useEffect(() => {
    const currentTestResults = form.getValues("testResults") || [];
    const updatedTestResults = Array(testIds.length)
      .fill(null)
      .map((_, index) => currentTestResults[index] || { interpretation: "" });
    form.setValue("testResults", updatedTestResults);
  }, [testIds, form]);

  const onSubmit = async (values: z.infer<typeof createImageResultsSchema>) => {
    try {
      const requestData: CreateImageResultInterface = {
        userDetailsId,
        reviewerId: providerDetails.providerId,
        testResults: selectedTests.map((test, index) => ({
          imageTestId: test.id,
          interpretation: values.testResults[index]?.interpretation || "",
          documents: uploadedImages,
        })),
        // testResults: values.testResults.map((test, index) => ({
        //   imageTestId: selectedTests[index]?.id ?? "",
        //   interpretation: test?.interpretation,
        //   documents: uploadedImages,
        // })),
      };

      const response = await createImageResultRequest({ requestData });
      if (response) {
        showToast({
          toast,
          type: "success",
          message: "Added image result successfully",
        });
        form.reset();
        setUploadedImages([]);
        setSelectedTests([]);
      }
    } catch (e) {
      console.log("Error", e);
      showToast({
        toast,
        type: "error",
        message: "Error while adding image results!",
      });
    } finally {
      form.reset();
      router.push(`/dashboard/provider/patient/${userDetailsId}/images`);
    }
  };

  return (
    <>
      <div className="space-y-4">
        <CreateImageResultHeader form={form} userDetailsId={userDetailsId} />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {loading ? (
              <div>Fetching...</div>
            ) : (
              imageTestResponse?.data && (
                <TestsField
                  form={form}
                  selectedTests={selectedTests}
                  setSelectedTests={setSelectedTests}
                  tests={imageTestResponse?.data}
                />
              )
            )}
            <div className="flex gap-2 flex-wrap">
              {selectedTests.map((test, index) => (
                <Card className="w-full sm:w-1/2 lg:w-1/3" key={index}>
                  <CardHeader>
                    <CardTitle>{`Test Results for ${test.name}`}</CardTitle>
                  </CardHeader>
                  <CardContent className="w-full">
                    <div key={test.id} className="flex gap-4 w-full flex-col">
                      <ImageFileUploader
                        onUploadComplete={(images) =>
                          handleUploadComplete(images)
                        }
                        userDetailsId={form.getValues().patient}
                        testId={test.id}
                      />
                      <FormField
                        control={form.control}
                        name={`testResults.${index}.interpretation`}
                        render={({ field }) => (
                          <FormItem className={formStyles.formBody}>
                            <FormLabel>Interpretation</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="Interpretation"
                                value={
                                  typeof field.value === "string"
                                    ? field.value
                                    : ""
                                }
                                className="w-full"
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
            <SubmitButton label="Submit" disabled={!form.formState.isValid} />
          </form>
        </Form>
      </div>
    </>
  );
};

export default CreatePatientImageResults;
