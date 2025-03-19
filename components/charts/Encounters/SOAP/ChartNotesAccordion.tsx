import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import FormLabels from "@/components/custom_buttons/FormLabels";
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
import TwoInput from "@/components/ui/TwoInput";

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
}

const ChartNotesAccordion = ({
  patientDetails,
  subjective,
  setSubjective,
  setObjective,
  setPhysicalStats,
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
    }
  }, [subjective, patientDetails?.userDetails, form]);

  const weightLbs = form.watch("weightInLbs");
  const weightOzs = form.watch("weightInOzs");
  const heightFeets = form.watch("heightInFt");
  const heightInches = form.watch("heightInInches");
  const bmi = form.watch("bmi");
  const startingWeight = form.watch("startingWeight");
  const goalWeight = form.watch("goalWeight");

  useEffect(() => {
    if (weightLbs && heightFeets && heightInches) {
      const totalHeightInInches =
        Number(heightFeets) * 12 + Number(heightInches);
      const bmi = (
        (Number(weightLbs) / totalHeightInInches ** 2) *
        703
      ).toFixed(2);
      form.setValue("bmi", Number(bmi));
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

  const handleWeightChange = ({
    first,
    second,
  }: {
    first: number;
    second: number;
  }) => {
    form.setValue("weightInLbs", first);
    form.setValue("weightInOzs", second);
  };

  const handleHeightChange = ({
    first,
    second,
  }: {
    first: number;
    second: number;
  }) => {
    form.setValue("heightInFt", first);
    form.setValue("heightInInches", second);
  };

  useEffect(() => {
    const plainText = extractPlainText(editorValue);
    setSubjective(plainText);
  }, [editorValue, setSubjective]);

  useEffect(() => {
    setObjective(
      `Weight is ${weightLbs} lbs ${weightOzs} ozs. Height is ${heightFeets} ft ${heightInches} inches. BMI is ${bmi}. The starting weight is ${startingWeight} and the goal Weight is ${goalWeight}`
    );
    setPhysicalStats({
      height: heightFeets,
      weight: weightLbs,
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
      <div className="flex flex-col gap-2">
        <h6>Chief Complaints</h6>
        <div className="flex flex-col gap-2">
          <PlateEditor
            value={editorValue}
            className=""
            onChange={(value) => {
              setEditorValue(value);
            }}
            placeholder="Enter chief complaints..."
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h6>Vitals</h6>
        <Form {...form}>
          <form className="[&_input]:!w-24 [&_input+label]:!absolute [&_input+label]:top-1/2 [&_input+label]:-translate-y-1/2 [&_input+label]:right-2 [&_input+label]:!text-xs [&_input+label]:!text-gray-500 [&_input+label]:!font-semibold">
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap gap-6">
                <FormLabels
                  className="flex-col !items-start"
                  label="Weight"
                  value={
                    <TwoInput
                      postfixFirst="lbs"
                      postfixSecond="ozs"
                      focusAfter={3}
                      idFirst="weight-first-input"
                      idSecond="weight-second-input"
                      onChange={handleWeightChange}
                    />
                  }
                />
                <FormLabels
                  label="Height"
                  className="flex-col !items-start"
                  value={
                    <TwoInput
                      postfixFirst="ft"
                      postfixSecond="in"
                      focusAfter={1}
                      idFirst="height-first-input"
                      idSecond="height-second-input"
                      onChange={handleHeightChange}
                    />
                  }
                />
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
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* <div className="flex justify-end items-end w-full">
                <Button type="submit" variant="ghost">
                  Save Content
                </Button>
              </div> */}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ChartNotesAccordion;
