import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import FormLabels from "@/components/custom_buttons/FormLabels";
import { Button } from "@/components/ui/button";
import {
  createSOAPChart,
  updatePatientPhysicalStatus,
  updateSOAPChart,
} from "@/services/chartsServices";
import { useToast } from "@/hooks/use-toast";
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
import { UserEncounterData } from "@/types/chartsInterface";
import LoadingButton from "@/components/LoadingButton";
import { showToast } from "@/utils/utils";
import "@/app/editor.css";
import { PlateEditor } from '@/components/ui/plate-editor/PlateEditor';
import { Descendant } from 'slate';
import TwoInput from '@/components/ui/TwoInput';

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
  encounterId: string;
}

const ChartNotesAccordion = ({ patientDetails, subjective, encounterId }: ChartNotesAccordionProps) => {
  const [editorValue, setEditorValue] = React.useState<Descendant[]>([
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weightInLbs: patientDetails?.progressTracker?.currentWeight
        ? Number(patientDetails?.progressTracker?.currentWeight)
        : 0,
      weightInOzs: 0,
      heightInFt: 0,
      heightInInches: 0,
      bmi: 0,
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
            type: 'paragraph',
            children: [{ text: subjective }],
          },
        ]);
      }
    }
  }, [subjective]);

  const handleWeightChange = ({ first, second }: { first: number; second: number }) => {
    form.setValue('weightInLbs', first);
    form.setValue('weightInOzs', second);
  };

  const handleHeightChange = ({ first, second }: { first: number; second: number }) => {
    form.setValue('heightInFt', first);
    form.setValue('heightInInches', second);
  };

  const handleSaveContent = async () => {
    try {
      setLoading(true);
      const requestBody = {
        subjective: JSON.stringify(editorValue),
      };
      
      if (patientDetails.chart?.id) {
        await updateSOAPChart({
          requestData: requestBody,
          chartId: patientDetails.chart.id,
        });
        showToast({ toast, type: "success", message: "Content saved successfully" });
      } else {
        const createRequestBody = {
          ...requestBody,
          encounterId: encounterId,
        };
        await createSOAPChart({ requestData: createRequestBody });
        showToast({ toast, type: "success", message: "Content saved successfully" });
      }
    } catch (e) {
      console.error("Error saving content:", e);
      showToast({ toast, type: "error", message: "Error saving content" });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("Values", values);
    try {
      setLoading(true);
      if (patientDetails.chart?.id) {
        const requestBody = {
          objective: `Weight is ${values.weightInLbs} lbs ${values.weightInOzs} ozs. Height is ${values.heightInFt} ft ${values.heightInInches} inches. BMI is ${values.bmi}. The starting weight is ${values.startingWeight} and the goal Weight is ${values.goalWeight}`,
        };
        await updateSOAPChart({
          requestData: requestBody,
          chartId: patientDetails.chart.id,
        });
        await updatePatientPhysicalStatus({
          userDetailsID: patientDetails?.userDetails?.userDetailsId,
          requestData: {
            height: Number(values.heightInInches),
            weight: Number(values.weightInLbs),
          },
        });
        showToast({ toast, type: "success", message: "Saved!" });
      } else {
        const requestBody = {
          subjective: "",
          objective: `Weight is ${values.weightInLbs} lbs ${values.weightInOzs} ozs. Height is ${values.heightInFt} ft ${values.heightInInches} inches. BMI is ${values.bmi}. The starting weight is ${values.startingWeight} and the goal Weight is ${values.goalWeight}`,
          encounterId: encounterId,
        };
        await createSOAPChart({ requestData: requestBody });
        await updatePatientPhysicalStatus({
          userDetailsID: patientDetails.userDetails.userDetailsId,
          requestData: {
            height: Number(values.heightInInches),
            weight: Number(values.weightInLbs),
          },
        });
        showToast({ toast, type: "success", message: "Saved!" });
      }
    } catch (e) {
      console.log("Error", e);
      showToast({ toast, type: "error", message: "Error while Saving!" });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <LoadingButton />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <h6>Chief Complaints</h6>
        <div className="flex flex-col gap-2">
          <PlateEditor
            value={editorValue}
            className=""
            onChange={(value) => setEditorValue(value)}
            placeholder="Enter chief complaints..."
          />
        </div>
        <div className="flex justify-end items-end w-full">
          <Button 
            variant="ghost" 
            onClick={handleSaveContent}
            disabled={loading}
          >
            Save Content
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h6>Vitals</h6>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} 
          className="[&_input]:!w-24 [&_input+label]:!absolute [&_input+label]:top-1/2 [&_input+label]:-translate-y-1/2 [&_input+label]:right-2 [&_input+label]:!text-xs [&_input+label]:!text-gray-500 [&_input+label]:!font-semibold">
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
                      <FormLabel>
                        BMI:
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="BMI"
                          {...field}
                          className="text-base font-semibold w-32"
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
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
                      <FormLabel>
                        Starting Weight:{" "}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="text-base font-semibold w-32"
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
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
                      <FormLabel>
                        Goal Weight:{" "}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="text-base font-semibold w-32"
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
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
              <div className="flex justify-end items-end w-full">
                <Button
                  type="submit"
                  variant="ghost"
                  onClick={handleSaveContent}
                >
                  Save Content
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ChartNotesAccordion;
