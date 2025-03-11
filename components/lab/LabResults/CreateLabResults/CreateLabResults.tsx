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
import { useRouter } from "next/navigation";
import { getLabsData } from "@/services/chartsServices";
import { LabsDataResponse, Test, TestInterface } from "@/types/chartsInterface";
import { createLabResultRequest } from "@/services/labResultServices";
import { showToast } from "@/utils/utils";
import { useToast } from "@/hooks/use-toast";
import { fetchProviderListDetails } from "@/services/registerServices";
import { FetchProviderListInterface } from "@/types/providerDetailsInterface";
import { fetchUserDataResponse } from "@/services/userServices";
import { UserData } from "@/types/userInterface";
import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";
import formStyles from "@/components/formStyles.module.css";

const CreateLabResults = () => {
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

  const { fields: testGroupFields } = useFieldArray({
    control: form.control,
    name: "testResults",
  });

  const [patients, setPatients] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleSearchList, setVisibleSearchList] = useState<boolean>(false);
  const [selectedTests, setSelectedTests] = useState<TestInterface[]>([]);
  const [loading, setLoading] = useState({
    lab: false,
    provider: false,
    patient: false,
  });
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
  }, [labResponse.total]);

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
    [labResponse]
  );

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

  useEffect(() => {
    fetchLabsData();
    fetchProvidersList();
  }, [fetchLabsData, fetchProvidersList]);

  useEffect(() => {
    fetchPatientList();
    if (selectedLab) {
      fetchLabTestsData(selectedLab);
    }
  }, [selectedLab, fetchLabTestsData, searchTerm, fetchPatientList]);

  const filteredPatients = patients.filter((patient) =>
    `${patient.user.firstName} ${patient.user.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const onSubmit = async (values: z.infer<typeof createLabResultsSchema>) => {
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
          message: "Lab Result saved sucessfully!",
        });
        router.replace("/dashboard/provider/labs");
      }
    } catch (e) {
      console.log("Error", e);
      showToast({
        toast,
        type: "error",
        message: "Error while saving Lab Results",
      });
    }
  };

  return (
    <>
      <div>
        <div className="flex justify-between">
          Add Lab Results
          <div className="flex gap-3">
            <Button
              variant={"outline"}
              className="border border-[#84012A] text-[#84012A]"
              onClick={() => {
                form.reset();
                router.replace("/dashboard/provider/labs");
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
                            {loading.patient ? (
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
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {loading.provider ? (
                              <div>Loading...</div>
                            ) : (
                              providerListData.data.map((providerList) => {
                                const providerId =
                                  providerList.providerDetails?.id ??
                                  providerList.id;
                                return (
                                  <SelectItem
                                    key={providerList.id}
                                    value={providerId}
                                  >{`${providerList.firstName} ${providerList.lastName}`}</SelectItem>
                                );
                              })
                            )}
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
            <FormField
              control={form.control}
              name="labId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lab Name</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value: string) => {
                        field.onChange(value);
                        setSelectedLab(value);
                      }}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a lab" />
                      </SelectTrigger>
                      <SelectContent>
                        {loading.lab ? (
                          <div>Loading...</div>
                        ) : (
                          labResponse &&
                          labResponse.data &&
                          labResponse.data.length > 0 &&
                          labResponse.data.map((lab) => (
                            <SelectItem key={lab.id} value={lab.id}>
                              {lab.name}
                            </SelectItem>
                          ))
                        )}
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
                    <h3 className="text-lg font-semibold">{`Test Results for ${test.name}`}</h3>
                    {testGroupFields.map((group, groupIndex) => (
                      <div
                        key={`${group.id}-${groupIndex}`}
                        className="border border-gray-300 rounded-lg p-4 mb-4"
                      >
                        <FormField
                          control={form.control}
                          name={`testResults.${groupIndex}.name`}
                          render={({ field }) => (
                            <FormItem>
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
                            <FormItem>
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
                            <FormItem>
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
                            <FormItem>
                              <FormLabel>Min</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Min"
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
                          name={`testResults.${groupIndex}.referenceMax`}
                          render={({ field }) => (
                            <FormItem>
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

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
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
    </>
  );
};

export default CreateLabResults;

export function DropdownMenuCheckboxesField({
  field,
  selectedTests,
  setSelectedTests,
  tests,
}: {
  field: FieldValues;
  selectedTests: TestInterface[];
  setSelectedTests: React.Dispatch<React.SetStateAction<TestInterface[]>>;
  tests: Test[];
}) {
  const handleTestChange = (value: TestInterface, checked: boolean) => {
    let updatedTests: TestInterface[];

    if (checked) {
      updatedTests = [...selectedTests, value];
    } else {
      updatedTests = selectedTests.filter((test) => test.id !== value.id);
    }

    setSelectedTests(updatedTests);
    field.onChange(updatedTests.map((test) => test.id));
  };

  return (
    <FormItem className={formStyles.formItem}>
      <FormLabel>Tests</FormLabel>
      <FormControl>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="overflow-hidden">
              {selectedTests.length > 0
                ? selectedTests.map((test) => test.name).join(", ")
                : "Select tests"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Select Tests</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {tests.map((test) => (
              <DropdownMenuCheckboxItem
                key={test.id}
                checked={selectedTests.includes(test)}
                onCheckedChange={(checked) => handleTestChange(test, checked)}
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
  selectedTests: TestInterface[];
  setSelectedTests: React.Dispatch<React.SetStateAction<TestInterface[]>>;
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
