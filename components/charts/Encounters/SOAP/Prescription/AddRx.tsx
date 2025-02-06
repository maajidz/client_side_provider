import GhostButton from "@/components/custom_buttons/GhostButton";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
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
import RxPatientDetailsSection from "./RxPatientDetailsSection";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UserEncounterData } from "@/types/chartsInterface";
import {
  createPrescriptions,
  createSOAPChart,
  updateSOAPChart,
} from "@/services/chartsServices";
import LoadingButton from "@/components/LoadingButton";
import { Switch } from "@/components/ui/switch";
import { showToast } from "@/utils/utils";
import { useToast } from "@/hooks/use-toast";
import SubmitButton from "@/components/custom_buttons/SubmitButton";

const AddRx = ({
  patientDetails,
  encounterId,
}: {
  patientDetails: UserEncounterData;
  encounterId: string;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [drugName, setDrugName] = useState<string>("");
  const [showPrescriptionForm, setShowPrescriptionForm] =
    useState<boolean>(false);
  const [dispenseAsWritten, setDispenseAsWritten] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const { toast } = useToast();

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

  const onSubmit = async (values: z.infer<typeof prescriptionSchema>) => {
    console.log(values);
    if (patientDetails.chart?.id) {
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
        chartId: patientDetails.chart?.id,
      };
      const data = {
        subjective: "",
        plan: `${JSON.stringify(requestData)}`,
        encounterId: encounterId,
      };
      try {
        setLoading(true);
        await createPrescriptions({ requestData: requestData });
        await updateSOAPChart({
          requestData: data,
          chartId: patientDetails.chart.id,
        });
        setShowPrescriptionForm(!showPrescriptionForm);
        showToast({ toast, type: "success", message: "Saved!" });
        setIsDialogOpen(false);
      } catch (e) {
        console.log("Error", e);
      } finally {
        setLoading(false);
        setIsDialogOpen(false);
      }
    } else {
      const data = {
        subjective: "",
        plan: `${JSON.stringify(values)}`,
        encounterId: encounterId,
      };
      try {
        setLoading(true);
        const response = await createSOAPChart({ requestData: data });
        if (response) {
          const chartId = response.id;
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
            chartId: chartId,
          };
          await createPrescriptions({ requestData: requestData });
          setShowPrescriptionForm(!showPrescriptionForm);
        }
        showToast({ toast, type: "success", message: "Saved!" });
      } catch (e) {
        console.log("Error", e);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div>
        <LoadingButton />
      </div>
    );
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <GhostButton label="Add Rx" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Add Prescription</DialogTitle>
        </DialogHeader>
        {showPrescriptionForm ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex flex-row">
                {drugName ? (
                  drugName
                ) : (
                  <Input
                    value={drugName}
                    onChange={(e) => setDrugName(e.target.value)}
                    placeholder="Enter drug name"
                  />
                )}
                <Switch
                  checked={dispenseAsWritten}
                  onCheckedChange={(value) => setDispenseAsWritten(value)}
                />
              </div>
              <div className="flex gap-3 items-center w-full">
                <div>Diagnosis</div>
                <FormField
                  control={form.control}
                  name="primary_diagnosis"
                  render={({ field }) => (
                    <FormItem className="w-full">
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
                <FormField
                  control={form.control}
                  name="secondary_diagnosis"
                  render={({ field }) => (
                    <FormItem className="w-full">
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
              <div className="flex gap-3 items-center">
                <div>Dosage: </div>
                <FormField
                  control={form.control}
                  name="dosage_quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Qty</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter quantity"
                          {...field}
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
                    <FormItem>
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
                            <SelectItem value="mg">mg</SelectItem>
                            <SelectItem value="ml">ml</SelectItem>
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
                    <FormItem>
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
                            <SelectItem value="route1">Route 1</SelectItem>
                            <SelectItem value="route2">Route 2</SelectItem>
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
                    <FormItem>
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
                  name="when"
                  render={({ field }) => (
                    <FormItem>
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
                    <FormItem>
                      <FormLabel>Duration</FormLabel>
                      <FormControl>
                        <Input placeholder="Duration" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="duration_unit"
                  render={({ field }) => (
                    <FormItem>
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
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="directions"
                render={({ field }) => (
                  <FormItem className="flex gap-3 items-center">
                    <FormLabel>Directions</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Duration" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-3 items-center">
                <div>Dispense</div>
                <FormField
                  control={form.control}
                  name="dispense_quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Quantity"
                          {...field}
                          className="w-28"
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
                    <FormItem>
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
                <FormField
                  control={form.control}
                  name="days_of_supply"
                  render={({ field }) => (
                    <FormItem className="flex gap-2 items-center">
                      <FormLabel className="w-fit">Days Supply</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder=""
                          {...field}
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
                    <FormItem className="flex gap-3 items-center">
                      <FormLabel className="w-fit">
                        Earliest Fill Date
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-3">
                <FormField
                  control={form.control}
                  name="prior_auth"
                  render={({ field }) => (
                    <FormItem className="flex gap-3 items-center">
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
                    <FormItem className="flex gap-3 items-center">
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="mt-0">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="option1">option 1</SelectItem>
                            <SelectItem value="option2">option 2</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="additional_refills"
                  render={({ field }) => (
                    <FormItem className="flex gap-3 items-center">
                      <FormLabel>Additional Refills</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder=""
                          {...field}
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
              <div className="flex gap-3 items-center">
                <FormField
                  control={form.control}
                  name="internal_comments"
                  render={({ field }) => (
                    <FormItem className="flex gap-3 items-center">
                      <FormLabel>Internal Comments</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="Note_to_Pharmacy"
                  render={({ field }) => (
                    <FormItem className="flex gap-3 items-center">
                      <FormLabel>Note to Pharmacy</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-3">
                <SubmitButton label="Save" />
                <Button
                  variant={"outline"}
                  onClick={() => setShowPrescriptionForm(!showPrescriptionForm)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <div className="flex flex-col gap-2">
            <RxPatientDetailsSection
              userDetailsId={patientDetails.userDetails.id}
            />
            <div className="flex flex-col p-3 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold text-gray-700">
                  Search & Add Rx
                </span>
                <Input
                  value={drugName}
                  placeholder="Enter drug name"
                  className="w-1/2 rounded-md"
                  onChange={(e) => setDrugName(e.target.value)}
                />
              </div>
              <div className="flex items-center">
                <div className="flex text-center">
                  Please search for your drug. If not found,
                </div>
                <Button
                  variant={"ghost"}
                  onClick={() => setShowPrescriptionForm(!showPrescriptionForm)}
                  className="text-[#84012A]"
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
