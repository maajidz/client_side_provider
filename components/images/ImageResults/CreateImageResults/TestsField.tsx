import { MultiSelectCheckbox, Option } from "@/components/ui/multiselectDropdown";
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
  const options: Option[] = tests.map(test => ({
    id: test.id,
    label: test.name,
  }));

  return (
    <FormField
      control={form.control}
      name="testIds"
      render={({ field }) => (
        <MultiSelectCheckbox
          options={options}
          onChange={(selectedOptions) => {
            const selectedTests = tests.filter(test => selectedOptions.includes(test.id));
            setSelectedTests(selectedTests);
            field.onChange(selectedOptions);
          }}
          defaultSelected={selectedTests.map(test => test.id)}
          label="Select Tests"
        />
      )}
    />
  );
};
