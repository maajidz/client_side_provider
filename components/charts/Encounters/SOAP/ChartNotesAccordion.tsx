import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  PatientPhysicalStats,
  UserEncounterData,
} from "@/types/chartsInterface";
import "@/app/editor.css";
import { PlateEditor } from "@/components/ui/plate-editor/PlateEditor";
import { Descendant } from "slate";
import { formatSentAt } from "@/utils/dateUtils";

const formSchema = z.object({
  weightInLbs: z.number(),
  weightInOzs: z.number().optional(),
  heightInFt: z.number(),
  heightInInches: z.number().optional(),
  bmi: z.number(),
  startingWeight: z.number(),
  goalWeight: z.number(),
});

interface ChartNotesAccordionProps {
  patientDetails: UserEncounterData;
  subjective?: string;
  setSubjective: (text: string) => void;
  setObjective: (text: string) => void;
  setPhysicalStats: (stats: PatientPhysicalStats) => void;
  signed: boolean;
}

const ChartNotesAccordion = ({
  patientDetails,
  subjective,
  setSubjective,
  setObjective,
  setPhysicalStats,
  signed,
}: ChartNotesAccordionProps) => {
  const [editorValue, setEditorValue] = React.useState<Descendant[]>([
    {
      type: "paragraph",
      children: [{ text: `${subjective}` }],
    },
  ]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weightInLbs: patientDetails?.userDetails?.weight
        ? Number(patientDetails?.userDetails?.weight)
        : undefined,
      weightInOzs: undefined,
      heightInFt: patientDetails?.userDetails?.height
        ? Number(patientDetails?.userDetails?.height)
        : undefined,
      heightInInches: undefined,
      bmi: 0,
      startingWeight: 0,
      goalWeight: 0,
    },
  });

  useEffect(() => {
    if (subjective) {
      try {
        const content = JSON.parse(subjective);
        if (Array.isArray(content)) {
          setEditorValue(content);
        }
      } catch (error) {
        console.log("Error", error);
        setEditorValue([
          {
            type: "paragraph",
            children: [{ text: subjective }],
          },
        ]);
      }
    }
    if (patientDetails?.userDetails) {
      form.setValue("weightInLbs", Number(patientDetails?.userDetails?.weight));
      form.setValue("heightInFt", Number(patientDetails?.userDetails?.height));
      form.setValue(
        "goalWeight",
        Number(patientDetails?.progressTracker?.targetWeight)
      );
    }
  }, [subjective, patientDetails?.userDetails, form, patientDetails?.progressTracker]);

  const weightLbs = form.watch("weightInLbs");
  const weightOzs = form.watch("weightInOzs");
  const heightFeets = form.watch("heightInFt");
  const heightInches = form.watch("heightInInches");
  const bmi = form.watch("bmi");
  const startingWeight = form.watch("startingWeight");
  const goalWeight = form.watch("goalWeight");

  useEffect(() => {
    if (weightLbs && heightFeets && heightFeets > 0) {
      const totalHeightInInches =
        Number(heightFeets) * 12 + (Number(heightInches) || 0);
      if (totalHeightInInches > 0) {
        const bmiValue = (
          (Number(weightLbs) / totalHeightInInches ** 2) *
          703
        ).toFixed(2);
        form.setValue("bmi", Number(bmiValue));
      }
    }
  }, [weightLbs, heightFeets, heightInches, form]);

  const extractPlainText = (content: Descendant[]): string => {
    return content
      .map((node) => {
        if ("text" in node) {
          return node.text;
        } else if ("children" in node) {
          return node.children.map((child) => child.text).join(" "); // Extract text from children
        }
        return "";
      })
      .join("\n");
  };

  // const handleInputChange = (
  //   fieldName: keyof z.infer<typeof formSchema>,
  //   value: number
  // ) => {
  //   form.setValue(fieldName, value);
  // };

  useEffect(() => {
    const plainText = extractPlainText(editorValue);
    setSubjective(plainText);
  }, [editorValue, setSubjective]);

  useEffect(() => {
    const objectiveText = `Weight is ${weightLbs || 0} lbs ${
      weightOzs || 0
    } ozs. Height is ${heightFeets || 0} ft ${
      heightInches || 0
    } inches. BMI is ${bmi}. The starting weight is ${
      startingWeight || 0
    } and the goal Weight is ${goalWeight || 0}`;
    const totalHeightInInches =
      Number(heightFeets) * 12 + (Number(heightInches) || 0);
    setObjective(objectiveText);
    setPhysicalStats({
      height: totalHeightInInches || 0,
      weight: weightLbs || 0,
    });
  }, [
    weightLbs,
    weightOzs,
    heightFeets,
    heightInches,
    bmi,
    startingWeight,
    goalWeight,
    setObjective,
    setPhysicalStats,
  ]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex self-end text-xs text-gray-500">
        Last saved at: {formatSentAt(patientDetails?.chart?.updatedAt)}
      </div>
      <div className="flex flex-col gap-2">
        <h6>Chief Complaints</h6>
        <div className="flex flex-col gap-2">
          {signed ? (
            <div className="border rounded-md p-2.5">
              {extractPlainText(editorValue)}
            </div>
          ) : (
            <PlateEditor
              value={editorValue}
              className=""
              onChange={(value) => {
                setEditorValue(value);
              }}
              placeholder="Enter chief complaints..."
            />
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h6>Vitals</h6>
        <Form {...form}>
          <form className="[&_input]:!w-24 [&_input+label]:!absolute [&_input+label]:top-1/2 [&_input+label]:-translate-y-1/2 [&_input+label]:right-2 [&_input+label]:!text-xs [&_input+label]:!text-gray-500 [&_input+label]:!font-semibold">
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap gap-6">
                <div className="flex gap-3 w-full items-end">
                  <FormField
                    control={form.control}
                    name="weightInLbs"
                    render={({ field }) => (
                      <FormItem className="flex gap-1 items-start">
                        <FormLabel className="w-fit">Weight</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              value={field.value ?? ""}
                              onChange={(event) =>
                                field.onChange(event.target.valueAsNumber)
                              }
                            />
                            <span className="flex items-center text-xs bg-gray-50 pl-2 pr-2 h-9 text-gray-500 font-semibold absolute top-0 right-0 border border-l-0 rounded-md rounded-l-none">
                              lbs
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="weightInOzs"
                    render={({ field }) => (
                      <FormItem className="flex gap-1 items-start">
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type="number"
                              className="w-fit"
                              value={field.value ?? ""}
                              onChange={(event) =>
                                field.onChange(event.target.valueAsNumber)
                              }
                            />
                            <span className="flex items-center text-xs bg-gray-50 pl-2 pr-2 h-9 text-gray-500 font-semibold absolute top-0 right-0 border border-l-0 rounded-md rounded-l-none">
                              ozs
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="heightInFt"
                    render={({ field }) => (
                      <FormItem className="flex gap-1 items-start">
                        <FormLabel className="w-fit">Height</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type="number"
                              className="w-fit"
                              value={field.value ?? ""}
                              onChange={(event) =>
                                field.onChange(event.target.valueAsNumber)
                              }
                            />
                            <span className="flex items-center text-xs bg-gray-50 pl-2 pr-2 h-9 text-gray-500 font-semibold absolute top-0 right-0 border border-l-0 rounded-md rounded-l-none">
                              feet
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="heightInInches"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type="number"
                              className="w-fit"
                              value={field.value ?? ""}
                              onChange={(event) =>
                                field.onChange(event.target.valueAsNumber)
                              }
                            />
                            <span className="flex items-center text-xs bg-gray-50 pl-2 pr-2 h-9 text-gray-500 font-semibold absolute top-0 right-0 border border-l-0 rounded-md rounded-l-none">
                              inches
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="bmi"
                  render={({ field }) => (
                    <FormItem className="flex gap-1 items-start">
                      <FormLabel>BMI:</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="BMI"
                          {...field}
                          className="text-base font-semibold w-32"
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                          type="number"
                          inputMode="numeric"
                          disabled={signed}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="startingWeight"
                  render={({ field }) => (
                    <FormItem className="flex gap-1 items-start relative">
                      <FormLabel>Starting Weight: </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="text-base font-semibold w-32"
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                          type="number"
                          inputMode="numeric"
                          disabled={signed}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="goalWeight"
                  render={({ field }) => (
                    <FormItem className="flex gap-1 items-start relative">
                      <FormLabel>Goal Weight: </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="text-base font-semibold w-32"
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                          type="number"
                          inputMode="numeric"
                          disabled={signed}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ChartNotesAccordion;
