import { DropdownMenuCheckboxesField } from "@/components/lab/LabResults/CreateLabResults/CreateLabResults";
import { FormField } from "@/components/ui/form";
import { createImageResultsSchema } from "@/schema/createImageResultsSchema";
import { ImagesTestData, TestInterface } from "@/types/chartsInterface";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

export const TestsField = ({
  form,
  selectedTests,
  setSelectedTests,
  tests,
}: {
  form: UseFormReturn<z.infer<typeof createImageResultsSchema>>;
  selectedTests: TestInterface[];
  setSelectedTests: React.Dispatch<React.SetStateAction<TestInterface[]>>;
  tests: ImagesTestData[];
}) => {
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
};
