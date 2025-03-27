import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { questionnaireSchema } from "@/schema/questionnaireSchema";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import GhostButton from "@/components/custom_buttons/buttons/GhostButton";

const questionnaireOptions = [
  "HIPAA Notice and Consent for PHI",
  "MMH PHQ9",
  "Dermatology Initial Assessment",
  "Asynchronous Refill Request",
  "HHH_Nutrition- Meal Plan Journal",
  "Hair Loss Initial Questionnaire",
  "New Patient Medical History Form",
];

function QuestionnairePreviewDialog() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);

  const form = useForm<z.infer<typeof questionnaireSchema>>({
    resolver: zodResolver(questionnaireSchema),
    defaultValues: {
      currentWeight: 120,
      currentHeight: 94,
      normalBodyWeight: 90,
      weightChange: "Yes",
      weightGained: "",
      currentDiet: "",
    },
  });

  function handleIsModalOpen(open: boolean) {
    setIsModalOpen(open);
  }

  function handleCheckboxChange(question: string) {
    setSelectedQuestions((prevSelected) =>
      prevSelected.includes(question)
        ? prevSelected.filter((item) => item !== question)
        : [...prevSelected, question]
    );
  }

  function handleSelectedCheckboxSubmission() {
    setIsModalOpen(false);
    setIsSecondModalOpen(true);
  }

  function handleQuestionsSubmit(data: z.infer<typeof questionnaireSchema>) {
    console.log("Form Data", data);

    setSelectedQuestions([]);
    form.reset();
  }

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={handleIsModalOpen}>
        <DialogTrigger asChild>
          <GhostButton>Add Now</GhostButton>
        </DialogTrigger>
        <DialogContent className="max-w-lg">
          <DialogHeader className=" p-4 rounded-t-lg">
            <DialogTitle asChild>Add Questionnaire</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 my-4">
            {questionnaireOptions.map((question) => (
              <div className="flex items-center space-x-2" key={question}>
                <Checkbox
                  id={question}
                  required={true}
                  checked={selectedQuestions.includes(question)}
                  onCheckedChange={() => handleCheckboxChange(question)}
                />
                <label htmlFor={question} className="text-sm">
                  {question}
                </label>
              </div>
            ))}
          </div>
          <DialogFooter className="flex justify-end">
            <Button variant="ghost" onClick={() => handleIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-orange-400 text-white hover:bg-orange-600"
              onClick={handleSelectedCheckboxSubmission}
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Questions Form */}
      <Dialog open={isSecondModalOpen} onOpenChange={setIsSecondModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader className="p-4 rounded-t-lg">
            <DialogTitle className="text-lg font-bold text-gray-800" asChild>
              General Information
            </DialogTitle>
          </DialogHeader>

          {/* Form Inputs */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleQuestionsSubmit)}>
              <div className="flex flex-col gap-5 p-4">
                <FormField
                  control={form.control}
                  name="currentWeight"
                  render={({ field }) => (
                    <FormItem className="flex gap-2 items-center">
                      <FormLabel className="w-full">
                        Current weight (in pounds)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={field.value}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          placeholder="Enter weight"
                          className="border rounded-md p-2 w-full text-gray-800"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currentHeight"
                  render={({ field }) => (
                    <FormItem className="flex gap-2 items-center">
                      <FormLabel className="w-full">Current height</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={field.value}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          placeholder="Enter height"
                          className="border rounded-md p-2 w-full text-gray-800"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="normalBodyWeight"
                  render={({ field }) => (
                    <FormItem className="flex gap-2 items-center">
                      <FormLabel className="w-full">
                        What do you consider your normal body weight, the weight
                        you have weighted majority of your life?
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={field.value}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          placeholder="Enter normal body weight"
                          className="border rounded-md p-2 w-full text-gray-800"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="weightChange"
                  render={({ field }) => (
                    <FormItem className="flex gap-2 items-center">
                      <FormLabel className="w-full">
                        Has your weight changed in the last 3 months?
                      </FormLabel>
                      <FormControl>
                        <Select {...field} onValueChange={field.onChange}>
                          <SelectTrigger className="border rounded-md p-2 w-full text-gray-800">
                            <SelectValue placeholder="Choose 'Yes' or 'No'" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="weightGained"
                  render={({ field }) => (
                    <FormItem className="flex gap-2 items-center">
                      <FormLabel className="w-full">
                        If yes, how much weight have you gained & why
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          {...field}
                          placeholder="Describe the weight gain"
                          className="border rounded-md p-2 w-full text-gray-800"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currentDiet"
                  render={({ field }) => (
                    <FormItem className="flex gap-2 items-center">
                      <FormLabel className="w-full">
                        Are you currently on a diet or meal plan?
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          {...field}
                          placeholder="Describe your current diet"
                          className="border rounded-md p-2 w-full text-gray-800"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter className="flex justify-end space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => setIsSecondModalOpen(false)}
                  className="bg-gray-300 text-gray-700 hover:bg-gray-400"
                >
                  Close
                </Button>
                <Button
                  variant="ghost"
                  type="submit"
                  className="bg-orange-400 text-white hover:bg-orange-600"
                >
                  Submit
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default QuestionnairePreviewDialog;