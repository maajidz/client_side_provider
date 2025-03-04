"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createLabResultsSchema } from "@/schema/createLabResultsSchema";
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
import { useToast } from "@/hooks/use-toast";
import { getLabsData } from "@/services/chartsServices";
import { createLabResultRequest } from "@/services/labResultServices";
import { fetchProviderListDetails } from "@/services/registerServices";
import { LabsDataResponse, Test } from "@/types/chartsInterface";
import { FetchProviderListInterface } from "@/types/providerDetailsInterface";
import { showToast } from "@/utils/utils";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useCallback, useEffect } from "react";
import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";
import formStyles from "@/components/formStyles.module.css";
import PageContainer from "@/components/layout/page-container";

const CreateResultRecord = () => {
  // Loading State
  const [loading, setLoading] = useState({
    lab: false,
    provider: false,
    patient: false,
    patients: false,
  });

  // User Details ID extracted from query parameters
  const params = useParams();
  const userDetailsId = Array.isArray(params.userDetailsId)
    ? params.userDetailsId[0]
    : params.userDetailsId;

  // Form State for Lab Results
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

  if (userDetailsId) {
    form.setValue("patient", userDetailsId);
  }

  const { fields: testGroupFields } = useFieldArray({
    control: form.control,
    name: "testResults",
  });

  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [labResponse, setLabResponse] = useState<LabsDataResponse>({
    data: [],
    total: 0,
  });
  const [labTestResponse, setLabTestResponse] = useState<Test[]>([]);
  const [providerListData, setProviderListData] =
    useState<FetchProviderListInterface>({
      data: [],
      total: 0,
    });
  const [selectedLab, setSelectedLab] = useState<string>("");
  const router = useRouter();
  const { toast } = useToast();

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

  const fetchLabTestsData = useCallback(
    async (labId: string) => {
      if (!labId) return;
      const selectedLab = labResponse?.data?.find((lab) => lab.id === labId);
      if (selectedLab) {
        setLabTestResponse(selectedLab.tests || []);
      }
    },
    [labResponse?.data]
  );

  useEffect(() => {
    fetchLabsData();
    fetchProvidersList();
  }, [fetchLabsData, fetchProvidersList]);

  useEffect(() => {
    if (selectedLab) {
      fetchLabTestsData(selectedLab);
    }
  }, [selectedLab, fetchLabTestsData]);

  const onSubmit = async () => {
    const values = form.getValues();

    const requestData = {
      userDetailsId: values.patient,
      reviewerId: values.reviewer,
      dateTime: values.dateTime,
      labId: values.labId,
      testIds: values.testIds,
      testResults: values.testResults.map((result) => ({
        name: result.name,
        result: result.result,
        unit: result.unit || "",
        min: result.referenceMin ?? 0,
        max: result.referenceMax ?? 0,
        interpretation: result.interpretation || "",
        comment: result.comment || "",
        groupComment: result.groupComment || "",
      })),
      tags: values.tags || "",
    };
    try {
      const response = await createLabResultRequest({ requestData });
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

  if (loading.provider || loading.patient || loading.patients || loading.lab) {
    return <LoadingButton />;
  }

  return (
    <>
      <PageContainer>
        <div>
          <div className="flex justify-between">
            Add Lab Results
            <div className="flex gap-3">
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
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className={`${formStyles.formBody} w-[30rem]`}
            >
              <div>
                <FormField
                  control={form.control}
                  name="reviewer"
                  render={({ field }) => (
                    <FormItem className={formStyles.formItem}>
                      <FormLabel className="">Reviewer:</FormLabel>
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
              </div>
              <FormField
                control={form.control}
                name="dateTime"
                render={({ field }) => (
                  <FormItem className={formStyles.formItem}>
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
              <FormField
                control={form.control}
                name="labId"
                render={({ field }) => (
                  <FormItem className={formStyles.formItem}>
                    <FormLabel>Lab Name</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(value: string) => {
                          field.onChange(value);
                          setSelectedLab(value);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a lab" />
                        </SelectTrigger>
                        <SelectContent>
                          {labResponse &&
                            labResponse.data &&
                            labResponse.data.length > 0 &&
                            labResponse.data.map((lab) => (
                              <SelectItem key={lab.id} value={lab.id}>
                                {lab.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <TestsField
                form={form}
                selectedTests={selectedTests}
                setSelectedTests={setSelectedTests}
                tests={labTestResponse}
              />
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
                            name={`testResults.${groupIndex}.name`}
                            render={({ field }) => (
                              <FormItem className={formStyles.formItem}>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Parameter Name"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`testResults.${groupIndex}.result`}
                            render={({ field }) => (
                              <FormItem className={formStyles.formItem}>
                                <FormLabel>Result</FormLabel>
                                <FormControl>
                                  <Input placeholder="Result" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`testResults.${groupIndex}.unit`}
                            render={({ field }) => (
                              <FormItem className={formStyles.formItem}>
                                <FormLabel>Unit</FormLabel>
                                <FormControl>
                                  <Input placeholder="Unit" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`testResults.${groupIndex}.referenceMin`}
                            render={({ field }) => (
                              <FormItem className={formStyles.formItem}>
                                <FormLabel>Min</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="number"
                                    placeholder="Min"
                                    value={field.value}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      field.onChange(
                                        value ? parseFloat(value) : undefined
                                      );
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`testResults.${groupIndex}.referenceMax`}
                            render={({ field }) => (
                              <FormItem className={formStyles.formItem}>
                                <FormLabel>Max</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="Max"
                                    {...field}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      field.onChange(
                                        value ? parseFloat(value) : undefined
                                      );
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`testResults.${groupIndex}.interpretation`}
                            render={({ field }) => (
                              <FormItem className={formStyles.formItem}>
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

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem className={formStyles.formItem}>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter tags" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <SubmitButton label="Submit" />
            </form>
          </Form>
        </div>
      </PageContainer>
    </>
  );
};

export default CreateResultRecord;

export function DropdownMenuCheckboxesField({
  field,
  selectedTests,
  setSelectedTests,
  tests,
}: {
  field: FieldValues;
  selectedTests: string[];
  setSelectedTests: React.Dispatch<React.SetStateAction<string[]>>;
  tests: Test[];
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
    <FormItem className={formStyles.formItem}>
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
  form: UseFormReturn<z.infer<typeof createLabResultsSchema>>;
  selectedTests: string[];
  setSelectedTests: React.Dispatch<React.SetStateAction<string[]>>;
  tests: Test[];
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
