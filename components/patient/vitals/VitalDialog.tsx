import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { addVitalsSchema } from "@/schema/vitalsSchema";
import { createVitalData, updateVitalData } from "@/services/vitalsServices";
import { RootState } from "@/store/store";
import { CreateVitalType, VitalsInterface } from "@/types/vitalsInterface";
import { showToast } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";

interface VitalsDialogProps {
  isOpen: boolean;
  userDetailsId: string;
  vitalsData?: VitalsInterface;
  onClose: () => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
};

function VitalDialog({
  isOpen,
  userDetailsId,
  vitalsData,
  onClose,
}: VitalsDialogProps) {
  // Provider State
  const providerDetails = useSelector((state: RootState) => state.login);

  // Loading State
  const [loading, setLoading] = useState(false);

  // BMI  SCALE
  const [bmiScale, setBmiScale] = useState<string>("");

  // Toast State
  const { toast } = useToast();

  // Form State
  const form = useForm<z.infer<typeof addVitalsSchema>>({
    resolver: zodResolver(addVitalsSchema),
    defaultValues: {
      dateTime: vitalsData?.dateTime ? formatDate(vitalsData.dateTime) : "",
      weightLbs: vitalsData?.weightLbs ?? undefined,
      weightOzs: vitalsData?.weightOzs ?? undefined,
      heightFeets: vitalsData?.heightFeets ?? undefined,
      heightInches: vitalsData?.heightInches ?? undefined,
      BMI: vitalsData?.BMI ?? undefined,
      startingWeight: vitalsData?.startingWeight ?? undefined,
      goalWeight: vitalsData?.goalWeight ?? undefined,
    },
  });

  const weightLbs = form.watch("weightLbs");
  const heightFeets = form.watch("heightFeets");
  const heightInches = form.watch("heightInches");

  useEffect(() => {
    if (weightLbs && heightFeets && heightInches) {
      const totalHeightInInches =
        Number(heightFeets) * 12 + Number(heightInches);
      const bmi = (
        (Number(weightLbs) / totalHeightInInches ** 2) *
        703
      ).toFixed(2);
      form.setValue("BMI", Number(bmi));
      const bmiNumber = Number(bmi);
      if (bmiNumber < 18.5) {
        setBmiScale("Underweight");
      } else if (bmiNumber >= 18.5 && bmiNumber < 24.9) {
        setBmiScale("Normal weight");
      } else if (bmiNumber >= 25 && bmiNumber < 29.9) {
        setBmiScale("Overweight");
      } else {
        setBmiScale("Obese");
      }
    }
  }, [weightLbs, heightFeets, heightInches, form]);

  // POST Vitals Data
  const onSubmit = async (formData: z.infer<typeof addVitalsSchema>) => {
    setLoading(true);

    const finalVitalData: CreateVitalType = {
      ...formData,
      userDetailsId,
      providerId: providerDetails.providerId,
    };

    try {
      if (vitalsData) {
        await updateVitalData({
          id: vitalsData.id,
          requestData: finalVitalData,
        });
        showToast({
          toast,
          type: "success",
          message: "Vital updated successfully",
        });
      } else {
        await createVitalData(finalVitalData);
        showToast({
          toast,
          type: "success",
          message: "Vital created successfully",
        });
      }
    } catch (err) {
      if (err instanceof Error) {
        showToast({
          toast,
          type: "error",
          message: "Vital creation failed",
        });
      } else {
        showToast({
          toast,
          type: "error",
          message: "Vital creation failed. An unknown error occurred",
        });
      }
    } finally {
      setLoading(false);
      onClose();
      form.reset();
      setBmiScale("");
    }
  };

  useEffect(() => {
    form.reset({
      BMI: vitalsData?.BMI,
      dateTime: vitalsData?.dateTime ? formatDate(vitalsData.dateTime) : "",
      goalWeight: vitalsData?.goalWeight,
      heightFeets: vitalsData?.heightFeets,
      heightInches: vitalsData?.heightInches,
      startingWeight: vitalsData?.startingWeight,
      weightLbs: vitalsData?.weightLbs,
      weightOzs: vitalsData?.weightOzs,
    });
  }, [form, vitalsData]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle asChild>
            {vitalsData ? "Edit Vital" : "Add Vital"}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5">
              {/* Date */}
              <FormField
                control={form.control}
                name="dateTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="w-fit">Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        className="w-fit"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Weight */}
              <div className="flex flex-col gap-1">
                <div className="flex gap-3 w-full items-end">
                  <FormField
                    control={form.control}
                    name="weightLbs"
                    render={({ field }) => (
                      <FormItem className="w-full">
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
                    name="weightOzs"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type="number"
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
                    name="heightFeets"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="w-fit">Height</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type="number"
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
                    name="heightInches"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type="number"
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
              </div>

              <div className="flex flex-row gap-5 items-center">
                {/* BMI */}
                <FormField
                  control={form.control}
                  name="BMI"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>BMI</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          className="w-fit"
                          value={field.value ?? ""}
                          onChange={(event) =>
                            field.onChange(event.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="mt-5 text-sm font-medium">{bmiScale}</div>
              </div>

              {/* Starting Weight */}
              <div className="flex gap-3 w-full items-end">
                <FormField
                  control={form.control}
                  name="startingWeight"
                  render={({ field }) => (
                    <FormItem className="flex-none">
                      <FormLabel>Starting Weight</FormLabel>
                      <FormControl>
                        <div>
                          <div className="relative">
                            <Input
                              {...field}
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
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div></div>
                {/* Goal Weight */}
                <FormField
                  control={form.control}
                  name="goalWeight"
                  render={({ field }) => (
                    <FormItem className="flex-none">
                      <FormLabel>Goal Weight</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
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
              </div>
              <DialogFooter>
                <div className="flex justify-end gap-2 w-fit">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <SubmitButton label="Save" disabled={loading} />
                </div>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default VitalDialog;
