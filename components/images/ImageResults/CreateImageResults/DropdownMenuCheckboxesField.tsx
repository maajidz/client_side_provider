import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { ImagesTestData } from "@/types/chartsInterface";
import {
    FieldValues
  } from "react-hook-form";

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
