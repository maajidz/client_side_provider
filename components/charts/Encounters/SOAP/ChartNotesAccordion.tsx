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
      // heightInFt: patientDetails.userDetails?.height
      //   ? Number(patientDetails.userDetails?.height)
      //   : 0,
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
    <div className="flex flex-col gap-6">
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
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap gap-3">
                <FormLabels
                  className="[]"
                  label="Weight"
                  value={
                    <div className="flex gap-2 items-center">
                      <FormField
                        control={form.control}
                        name="weightInLbs"
                        render={({ field }) => (
                          <FormItem className="flex gap-1 items-center">
                            <FormControl>
                              <Input
                                placeholder="Weight"
                                {...field}
                                className="text-base font-semibold w-32"
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                                type="number"
                                inputMode="numeric"
                              />
                            </FormControl>
                            <FormLabel className="text-base font-normal text-center">
                              lbs
                            </FormLabel>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="weightInOzs"
                        render={({ field }) => (
                          <FormItem className="flex gap-1 items-center">
                            <FormControl>
                              <Input
                                placeholder="Weight"
                                {...field}
                                className="text-base font-semibold w-32"
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                                type="number"
                                inputMode="numeric"
                              />
                            </FormControl>
                            <FormLabel className="text-base font-normal">
                              ozs
                            </FormLabel>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  }
                />
                <FormLabels
                  label="Height"
                  value={
                    <div className="flex gap-2 items-center">
                      <FormField
                        control={form.control}
                        name="heightInFt"
                        render={({ field }) => (
                          <FormItem className="flex gap-1 items-center">
                            <FormControl>
                              <Input
                                placeholder="Height"
                                {...field}
                                className="text-base font-semibold w-32"
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                                type="number"
                                inputMode="numeric"
                              />
                            </FormControl>
                            <FormLabel className="text-base font-normal text-center">
                              ft
                            </FormLabel>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="heightInInches"
                        render={({ field }) => (
                          <FormItem className="flex gap-1 items-center">
                            <FormControl>
                              <Input
                                placeholder="Height"
                                {...field}
                                className="text-base font-semibold w-32"
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                                type="number"
                                inputMode="numeric"
                              />
                            </FormControl>
                            <FormLabel className="text-base font-normal">
                              inches
                            </FormLabel>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  }
                />
                <FormField
                  control={form.control}
                  name="bmi"
                  render={({ field }) => (
                    <FormItem className="flex gap-1 items-center">
                      <FormLabel className="text-base font-normal">
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
                    <FormItem className="flex gap-1 items-center">
                      <FormLabel className="text-base font-normal">
                        Starting Weight:{" "}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Starting Wt"
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
                    <FormItem className="flex gap-1 items-center">
                      <FormLabel className="text-base text-center font-normal">
                        Goal Weight:{" "}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Goal Weight"
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
                  className="bg-[#84012A]"
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
