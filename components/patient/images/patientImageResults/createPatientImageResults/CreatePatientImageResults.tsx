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
import UploadImageResults from "@/components/images/ImageResults/CreateImageResults/UploadImageResults";
import { TestsField } from "@/components/images/ImageResults/CreateImageResults/TestsField";
import CreateImageResultHeader from "@/components/images/ImageResults/CreateImageResults/CreateImageResultHeader";
import { createImageResultRequest } from "@/services/imageResultServices";
import { CreateImageResultInterface } from "@/types/imageResults";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { showToast } from "@/utils/utils";
import { useToast } from "@/components/ui/use-toast";

const CreatePatientImageResults = ({
  userDetailsId,
}: {
  userDetailsId: string;
}) => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [imageTestResponse, setImageTestResponse] =
    useState<ImagesTestsResponseInterface>();
  const providerDetails = useSelector((state: RootState) => state.login);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof createImageResultsSchema>>({
    resolver: zodResolver(createImageResultsSchema),
    defaultValues: {
      patient: userDetailsId,
      testResults: [
        {
          interpretation: "",
        },
      ],
    },
  });

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
    fetchImageTestsData();
  }, [fetchImageTestsData]);

  const onSubmit = async (values: z.infer<typeof createImageResultsSchema>) => {
    console.log("values", values);
    try {
      const requestData: CreateImageResultInterface = {
        userDetailsId: userDetailsId,
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
        <CreateImageResultHeader form={form} userDetailsId={userDetailsId} />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
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
                    userDetailsId={userDetailsId}
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

export default CreatePatientImageResults;
