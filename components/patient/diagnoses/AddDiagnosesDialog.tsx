import SubmitButton from "@/components/custom_buttons/SubmitButton";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { addDiagnosesSchema } from "@/schema/diagnosesSchema";
import { createDiagnoses } from "@/services/chartsServices";
import { RootState } from "@/store/store";
import { CreateDiagnosesRequestBody } from "@/types/chartsInterface";
import { showToast } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import React from "react";
import { useSelector } from "react-redux";
import GhostButton from "@/components/custom_buttons/GhostButton";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AddDiagnosesDialogProps {
  isOpen: boolean;
  userDetailsId: string;
  onClose: () => void;
}

export default function AddDiagnosesDialog({
  isOpen,
  userDetailsId,
  onClose,
}: AddDiagnosesDialogProps) {
  // Provider Details
  const providerDetails = useSelector((state: RootState) => state.login);

  console.log(providerDetails);
  console.log(userDetailsId);

  // Loading State
  const [loading, setLoading] = useState(false);

  // Toast State
  const { toast } = useToast();

  // Form State
  const form = useForm<z.infer<typeof addDiagnosesSchema>>({
    resolver: zodResolver(addDiagnosesSchema),
    defaultValues: {
      diagnoses: [
        {
          diagnosis_name: "",
          ICD_Code: "1",
          fromDate: new Date().toISOString().split("T")[0],
          toDate: new Date().toISOString().split("T")[0],
          status: "inactive",
          notes: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "diagnoses",
  });

  // POST Diagnosis Data
  const onSubmit = async (values: z.infer<typeof addDiagnosesSchema>) => {
    setLoading(true);
    console.log(values);

    const requestData: CreateDiagnosesRequestBody[] = values.diagnoses.map(
      (diagnosis) => ({
        diagnosis_name: diagnosis.diagnosis_name,
        ICD_Code: diagnosis.ICD_Code,
        notes: diagnosis.notes,
        chartId: "",
      })
    );

    try {
      await createDiagnoses({ requestData });

      showToast({
        toast,
        type: "success",
        message: "Diagnoses data created successfully",
      });
    } catch (err) {
      if (err instanceof Error) {
        showToast({
          toast,
          type: "error",
          message: "Could not create diagnoses data",
        });
      } else {
        showToast({
          toast,
          type: "error",
          message: "Could not create diagnoses data. An unknown error occurred",
        });
      }
    } finally {
      setLoading(false);
      form.reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Add Diagnoses</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ScrollArea className="max-h-[30rem] h-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-left font-semibold border-b">
                    <th className="px-3 py-2">Diagnosis</th>
                    <th className="px-3 py-2">ICD Code</th>
                    <th className="px-3 py-2">From Date</th>
                    <th className="px-3 py-2">To Date</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Notes</th>
                  </tr>
                </thead>
                <tbody className="space-y-2">
                  {fields.map((field, index) => (
                    <tr key={field.id} className="space-x-4">
                      <td className="p-2">
                        <FormField
                          control={form.control}
                          name={`diagnoses.${index}.diagnosis_name`}
                          render={({ field }) => (
                            <FormItem>
                              <Input
                                {...field}
                                placeholder="Search by name or code"
                                value={field.value}
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </td>

                      <td className="p-2">
                        <FormField
                          control={form.control}
                          name={`diagnoses.${index}.ICD_Code`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input {...field} value={field.value} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </td>

                      <td className="p-2">
                        <FormField
                          control={form.control}
                          name={`diagnoses.${index}.fromDate`}
                          render={({ field }) => (
                            <FormItem>
                              <Input
                                {...field}
                                type="date"
                                value={field.value}
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </td>

                      <td className="p-2">
                        <FormField
                          control={form.control}
                          name={`diagnoses.${index}.toDate`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="date"
                                  value={field.value}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </td>

                      <td className="p-2">
                        <FormField
                          control={form.control}
                          name={`diagnoses.${index}.status`}
                          render={({ field }) => (
                            <FormItem>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="active">Active</SelectItem>
                                  <SelectItem value="inactive">
                                    Inactive
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </td>

                      <td className="p-2">
                        <FormField
                          control={form.control}
                          name={`diagnoses.${index}.notes`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input {...field} value={field.value} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </td>

                      {fields.length > 1 && (
                        <td className="p-2">
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => remove(index)}
                          >
                            <Trash2Icon />
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>

              <DialogFooter className="flex flex-between">
                <div className="w-full">
                  <GhostButton
                    label="Add More"
                    onClick={() =>
                      append({
                        diagnosis_name: "",
                        ICD_Code: "1",
                        fromDate: "",
                        toDate: "",
                        status: "active",
                        notes: "",
                      })
                    }
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      onClose();
                      form.reset();
                    }}
                  >
                    Cancel
                  </Button>
                  <SubmitButton label="Save" disabled={loading} />
                </div>
              </DialogFooter>
            </ScrollArea>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
