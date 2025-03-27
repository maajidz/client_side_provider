import React, { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { prescriptionSchema } from "@/schema/prescriptionSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UserEncounterData } from "@/types/chartsInterface";
import formStyles from "@/components/formStyles.module.css";
import {
  createPrescriptions,
  createSOAPChart,
  updateSOAPChart,
} from "@/services/chartsServices";
import LoadingButton from "@/components/LoadingButton";
import { Switch } from "@/components/ui/switch";
import { showToast } from "@/utils/utils";
import { useToast } from "@/hooks/use-toast";
import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";
import { getDosageUnits, getFrequencyData } from "@/services/enumServices";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";

const AddRx = ({
  patientDetails,
  encounterId,
  signed,
}: {
  patientDetails: UserEncounterData;
  encounterId: string;
  signed: boolean;
}) => {
  const [loading, setLoading] = useState({
    post: false,
    dosage: false,
    frequency: false,
  });
  const [drugName, setDrugName] = useState<string>("");
  const [showPrescriptionForm, setShowPrescriptionForm] =
    useState<boolean>(false);
  const [dispenseAsWritten, setDispenseAsWritten] = useState<boolean>(false);
  const { toast } = useToast();

  // Frequency Data
  const [frequencyData, setFrequencyData] = useState<string[]>([]);

  // Dosage Units
  const [dosageUnits, setDosageUnits] = useState<string[]>([]);

  const form = useForm<z.infer<typeof prescriptionSchema>>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      primary_diagnosis: "",
      secondary_diagnosis: "",
      dosage_quantity: undefined,
      dosage_unit: "",
      route: "",
      frequency: "",
      when: "",
      duration_quantity: "",
      duration_unit: "",
      directions: "",
      dispense_quantity: undefined,
      dispense_unit: "",
      days_of_supply: undefined,
      earliest_fill_date: "",
      prior_auth: "",
      prior_auth_decision: "",
      additional_refills: undefined,
      internal_comments: "",
      Note_to_Pharmacy: "",
    },
  });

  const { watch } = form;

  // Watch the relevant fields
  const dosageQuantity = watch("dosage_quantity");
  const dosageUnit = watch("dosage_unit");
  const frequency = watch("frequency");
  const durationQuantity = watch("duration_quantity");
  const durationUnit = watch("duration_unit");
  const route = watch("route");

  // Function to generate directions
  const generateDirections = useCallback(() => {
    const qty = dosageQuantity ? `${dosageQuantity} ${dosageUnit}(s)` : "";
    const freq = frequency ? `${frequency} a day` : "";
    const whenText = watch("when") ? `before ${watch("when")}` : "";
    const duration = durationQuantity
      ? `for ${durationQuantity} ${durationUnit}(s)`
      : "";
    const routeText = route ? `via ${route}` : "";

    // Construct the directions string
    const directions = [qty, freq, whenText, duration, routeText]
      .filter(Boolean)
      .join(" ")
      .trim();
    return directions;
  }, [
    dosageQuantity,
    dosageUnit,
    frequency,
    durationQuantity,
    durationUnit,
    route,
    watch,
  ]);

  // GET Frequency Data
  const fetchFrequency = useCallback(async () => {
    setLoading((prev) => ({ ...prev, frequency: true }));

    try {
      const response = await getFrequencyData();

      if (response) {
        setFrequencyData(response);
      }
    } catch (err) {
      if (err instanceof Error) {
        showToast({
          toast,
          type: "error",
          message: "Could not fetch frequency data",
        });
      } else {
        showToast({
          toast,
          type: "error",
          message: "An unknown error occurred",
        });
      }
    } finally {
      setLoading((prev) => ({ ...prev, frequency: false }));
    }
  }, [toast]);

  // GET Dosage Units
  const fetchDosageUnits = useCallback(async () => {
    setLoading((prev) => ({ ...prev, dosage: true }));

    try {
      const response = await getDosageUnits();

      if (response) {
        setDosageUnits(response);
      }
    } catch (err) {
      if (err instanceof Error) {
        showToast({
          toast,
          type: "error",
          message: "Could not fetch dosage units",
        });
      } else {
        showToast({
          toast,
          type: "error",
          message: "An unknown error occurred",
        });
      }
    } finally {
      setLoading((prev) => ({ ...prev, dosage: false }));
    }
  }, [toast]);

  // Update the directions field whenever the relevant fields change
  useEffect(() => {
    const directions = generateDirections();
    form.setValue("directions", directions); // Update the directions field
  }, [form, generateDirections]);

  useEffect(() => {
    fetchFrequency();
    fetchDosageUnits();
  }, [fetchFrequency, fetchDosageUnits]);

  const onSubmit = async (values: z.infer<typeof prescriptionSchema>) => {
    setLoading((prev) => ({ ...prev, post: true }));

    if (patientDetails.chart.id) {
      const requestData = {
        drug_name: drugName,
        dispense_as_written: dispenseAsWritten,
        primary_diagnosis: values.primary_diagnosis,
        secondary_diagnosis: values.secondary_diagnosis,
        directions: values.directions,
        dispense_quantity: values.dispense_quantity,
        dispense_unit: String(values.dispense_quantity),
        prior_auth: values.prior_auth,
        prior_auth_decision: values.prior_auth_decision,
        internal_comments: values.internal_comments || "",
        days_of_supply: values.days_of_supply ?? 0,
        additional_refills: values.additional_refills,
        Note_to_Pharmacy: values.Note_to_Pharmacy,
        earliest_fill_date: values.earliest_fill_date || "",
        dosages: [
          {
            dosage_quantity: values.dosage_quantity,
            dosage_unit: values.dosage_unit,
            route: values.route,
            frequency: values.frequency,
            when: values.when,
            duration_quantity: values.duration_quantity,
            duration_unit: values.duration_unit,
          },
        ],
        chartId: patientDetails.chart.id,
      };
      try {
        await createPrescriptions({ requestData });
        const data = {
          plan: `Prescription: 
            ${requestData.drug_name} 
          Directions: ${requestData.directions}`,
          encounterId: encounterId,
        };
        await createSOAPChart({
          requestData: data,
        });
        await updateSOAPChart({
          chartId: patientDetails.chart.id,
          requestData: data,
        });
        setShowPrescriptionForm(!showPrescriptionForm);
        showToast({ toast, type: "success", message: "Saved!" });
      } catch (e) {
        console.log("Error", e);
      } finally {
        setLoading((prev) => ({ ...prev, post: false }));
        form.reset();
      }
    }
  };

  if (loading.post) {
    return <LoadingButton />;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"ghost"} disabled={signed}>
          Add Rx
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-fit">
        <DialogHeader>
          <DialogTitle asChild>Add Prescription</DialogTitle>
          {/* <DialogDescription>
            Add a prescription to the patient's chart.
          </DialogDescription> */}
        </DialogHeader>
        {showPrescriptionForm ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <ScrollArea className="h-[30rem] min-h-[30rem] p-2">
                <div className={formStyles.formBody}>
                  <div className="flex gap-8 flex-row justify-between">
                    <FormItem className="flex flex-1">
                      <FormLabel>Drug Name</FormLabel>
                      <Input
                        value={drugName}
                        className="w-full"
                        onChange={(e) => setDrugName(e.target.value)}
                        placeholder="Enter drug name"
                      />
                    </FormItem>
                    <FormItem className="inline-flex flex-row items-end gap-2 mb-3 flex-none">
                      <FormLabel>Dispense as Written</FormLabel>
                      <Switch
                        checked={dispenseAsWritten}
                        onCheckedChange={(value) => setDispenseAsWritten(value)}
                      />
                    </FormItem>
                  </div>
                  <div className={formStyles.formItem}>
                    <div className="flex w-full gap-3 items-end">
                      <FormField
                        control={form.control}
                        name="primary_diagnosis"
                        render={({ field }) => (
                          <FormItem className={`${formStyles.formItem} w-full`}>
                            <FormLabel>Diagnosis</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger className="mt-0">
                                  <SelectValue
                                    placeholder="Select"
                                    className="w-full"
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="diagnosis1">
                                    Diagnosis 1
                                  </SelectItem>
                                  <SelectItem value="diagnosis2">
                                    Diagnosis 2
                                  </SelectItem>
                                  <SelectItem value="diagnosis3">
                                    Diagnosis 3
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="secondary_diagnosis"
                        render={({ field }) => (
                          <FormItem className={`${formStyles.formItem} w-full`}>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger className="mt-0">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="diagnosis1">
                                    Diagnosis 1
                                  </SelectItem>
                                  <SelectItem value="diagnosis2">
                                    Diagnosis 2
                                  </SelectItem>
                                  <SelectItem value="diagnosis3">
                                    Diagnosis 3
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Dosage:</Label>
                    <div className="flex gap-3 flex-wrap bg-gray-50 p-4 rounded-md">
                      <FormField
                        control={form.control}
                        name="dosage_quantity"
                        render={({ field }) => (
                          <FormItem className="flex-none">
                            <FormLabel>Qty</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Qty"
                                className="bg-white"
                                value={field.value ?? ""}
                                onChange={(e) =>
                                  field.onChange(e.target.valueAsNumber || "")
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="dosage_unit"
                        render={({ field }) => (
                          <FormItem className="flex-none">
                            <FormLabel>Unit</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger className="mt-0">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  {dosageUnits.map((unit) => (
                                    <SelectItem key={unit} value={unit}>
                                      {unit}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="route"
                        render={({ field }) => (
                          <FormItem className="flex-none">
                            <FormLabel>Route</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger className="mt-0">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="route1">
                                    Route 1
                                  </SelectItem>
                                  <SelectItem value="route2">
                                    Route 2
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="frequency"
                        render={({ field }) => (
                          <FormItem className="flex-none">
                            <FormLabel>Frequency</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger className="mt-0">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  {loading.frequency ? (
                                    <div>Loading...</div>
                                  ) : (
                                    frequencyData.map((frequency) => (
                                      <SelectItem
                                        key={frequency}
                                        value={frequency}
                                      >
                                        {frequency}
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
                      <FormField
                        control={form.control}
                        name="when"
                        render={({ field }) => (
                          <FormItem className="flex-none">
                            <FormLabel>When</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger className="mt-0">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="frequency1">
                                    Frequency 1
                                  </SelectItem>
                                  <SelectItem value="frequency2">
                                    Frequency 2
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="duration_quantity"
                        render={({ field }) => (
                          <FormItem className="flex-none">
                            <FormLabel>Duration</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="duration_unit"
                        render={({ field }) => (
                          <FormItem className="flex-none">
                            <FormLabel>Duration Unit</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger className="mt-0">
                                  <SelectValue placeholder="duration type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="days">Days</SelectItem>
                                  <SelectItem value="weeks">Weeks</SelectItem>
                                  <SelectItem value="years">Years</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="directions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Directions</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Directions" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex w-full gap-3 flex-wrap">
                    <div className={`${formStyles.formItem}`}>
                      <FormLabel>Dispense</FormLabel>
                      <div className="flex gap-3">
                        <FormField
                          control={form.control}
                          name="dispense_quantity"
                          render={({ field }) => (
                            <FormItem className={`${formStyles.formItem}`}>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Quantity"
                                  className="w-28"
                                  value={field.value ?? ""}
                                  onChange={(e) =>
                                    field.onChange(e.target.valueAsNumber || "")
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="dispense_unit"
                          render={({ field }) => (
                            <FormItem
                              className={`${formStyles.formItem} w-full`}
                            >
                              <FormControl>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <SelectTrigger className="mt-0">
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="gram">Gram</SelectItem>
                                    <SelectItem value="lts">Lts</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <FormField
                      control={form.control}
                      name="days_of_supply"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Days Supply</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder=""
                              value={field.value ?? ""}
                              onChange={(e) =>
                                field.onChange(e.target.valueAsNumber || "")
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="earliest_fill_date"
                      render={({ field }) => (
                        <FormItem className={`${formStyles.formItem}`}>
                          <FormLabel>Earliest Fill Date</FormLabel>
                          <FormControl>
                            <Input type="date" placeholder="" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex gap-3 ">
                    <div className={`${formStyles.formItem}`}>
                      <div className="flex gap-3 items-end">
                        <FormField
                          control={form.control}
                          name="prior_auth"
                          render={({ field }) => (
                            <FormItem className={`${formStyles.formItem}`}>
                              <FormLabel>Prior Auth</FormLabel>
                              <FormControl>
                                <Input placeholder="Prior Auth" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="prior_auth_decision"
                          render={({ field }) => (
                            <FormItem className={`${formStyles.formItem}`}>
                              <FormControl>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <SelectTrigger className="mt-0">
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="option1">
                                      option 1
                                    </SelectItem>
                                    <SelectItem value="option2">
                                      option 2
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <FormField
                      control={form.control}
                      name="additional_refills"
                      render={({ field }) => (
                        <FormItem className={`${formStyles.formItem}`}>
                          <FormLabel>Additional Refills</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder=""
                              value={field.value ?? ""}
                              onChange={(e) =>
                                field.onChange(e.target.valueAsNumber || "")
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex gap-3 items-center w-full">
                    <FormField
                      control={form.control}
                      name="internal_comments"
                      render={({ field }) => (
                        <FormItem className={`${formStyles.formItem} w-full`}>
                          <FormLabel>Internal Comments</FormLabel>
                          <FormControl>
                            <Textarea {...field} className="w-full" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="Note_to_Pharmacy"
                      render={({ field }) => (
                        <FormItem className={`${formStyles.formItem} w-full`}>
                          <FormLabel>Note to Pharmacy</FormLabel>
                          <FormControl>
                            <Textarea {...field} className="w-full" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <DialogFooter className="flex justify-end gap-2">
                    <Button
                      variant={"outline"}
                      onClick={() =>
                        setShowPrescriptionForm(!showPrescriptionForm)
                      }
                    >
                      Cancel
                    </Button>
                    <SubmitButton label="Save" />
                  </DialogFooter>
                </div>
              </ScrollArea>
            </form>
          </Form>
        ) : (
          <div className="flex flex-col gap-2 w-fit">
            {/* <RxPatientDetailsSection
              userDetailsId={patientDetails.userDetails.userDetailsId}
            /> */}
            <div className="flex flex-col gap-4">
              <div className="flex gap-2 flex-col">
                <Label>Search & Add Rx</Label>
                <Input
                  value={drugName}
                  placeholder="Enter drug name"
                  className="w-full rounded-md"
                  onChange={(e) => setDrugName(e.target.value)}
                />
              </div>
              <div className="flex flex-row items-center">
                <Label>or</Label>
                <Button
                  variant={"link"}
                  className="w-fit"
                  onClick={() => setShowPrescriptionForm(!showPrescriptionForm)}
                >
                  Add a custom drug
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddRx;
