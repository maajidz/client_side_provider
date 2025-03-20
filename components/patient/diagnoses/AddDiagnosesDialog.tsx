import React, { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import GhostButton from "@/components/custom_buttons/buttons/GhostButton";
import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { addDiagnosesSchema } from "@/schema/diagnosesSchema";
import { createDiagnoses, fetchDiagnosesType } from "@/services/chartsServices";
import { RootState } from "@/store/store";
import {
  CreateDiagnosesRequestBody,
  DiagnosesTypeData,
} from "@/types/chartsInterface";
import { showToast } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2Icon } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";

interface AddDiagnosesDialogProps {
  isOpen: boolean;
  chartId: string;
  userDetailsId: string;
  onClose: () => void;
}

export default function AddDiagnosesDialog({
  isOpen,
  chartId,
  userDetailsId,
  onClose,
}: AddDiagnosesDialogProps) {
  // Provider Details
  const providerDetails = useSelector((state: RootState) => state.login);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [diagnosesTypeData, setDiagnosesTypeData] = useState<
    DiagnosesTypeData[]
  >([]);
  const [isListVisible, setIsListVisible] = useState<boolean>(false);

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
          diagnosis_Id: "",
          ICD_Code: "",
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

  const handleSearch = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchDiagnosesType({
        search: searchTerm,
        page: 1,
        limit: 10,
      });

      if (response) {
        setDiagnosesTypeData(response.data);
      }
    } catch (error) {
      console.error("Error fetching diagnoses data:", error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim()) {
        handleSearch();
      } else {
        setDiagnosesTypeData([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, handleSearch]);

  const filteredDiagnoses = diagnosesTypeData.filter(
    (diagnoses) =>
      diagnoses.diagnosis_name.toLocaleLowerCase().includes(searchTerm) ||
      diagnoses.ICD_Code.includes(searchTerm)
  );

  // POST Diagnosis Data
  const onSubmit = async (values: z.infer<typeof addDiagnosesSchema>) => {
    setLoading(true);

    const requestData: CreateDiagnosesRequestBody = {
      userDetailsId,
      providerId: providerDetails.providerId,
      diagnoses: values.diagnoses.map((diagnosis) => ({
        diagnosis_Id: diagnosis.diagnosis_Id,
        status: diagnosis.status,
        fromDate: diagnosis.fromDate,
        toDate: diagnosis.toDate,
        notes: diagnosis.notes,
        chartId,
      })),
    };

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
      onClose();
      setSearchTerm("");
      form.reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Add Diagnoses</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ScrollArea className="max-h-[30rem] h-auto">
              <table className=" table-auto">
                <thead>
                  <tr className="text-left font-medium">
                    <th className="">Diagnosis</th>
                    <th className="indent-2">ICD Code</th>
                    <th className="indent-2">From Date</th>
                    <th className="indent-2">To Date</th>
                    <th className="indent-2">Status</th>
                    <th className="indent-2">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {fields.map((field, index) => (
                    <tr key={field.id}>
                      <td>
                        <FormField
                          control={form.control}
                          name={`diagnoses.${index}.diagnosis_Id`}
                          render={({ field }) => (
                            <FormItem>
                              <div className="relative">
                                <Input
                                  value={searchTerm}
                                  placeholder="Search by name or code"
                                  onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setIsListVisible(true);
                                  }}
                                />
                                {searchTerm && isListVisible && (
                                  <div className="absolute bg-white border border-gray-200 text-sm font-medium mt-1 rounded shadow-md w-full">
                                    {filteredDiagnoses.length > 0 ? (
                                      filteredDiagnoses.map((diagnoses) => (
                                        <div
                                          key={diagnoses.id}
                                          className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                          onClick={() => {
                                            field.onChange(
                                              diagnoses.id
                                            );
                                            setSearchTerm(
                                              diagnoses.diagnosis_name
                                            );
                                            setIsListVisible(false);
                                            form.setValue(`diagnoses.${index}.ICD_Code`, diagnoses.ICD_Code)
                                          }}
                                        >
                                          {diagnoses.diagnosis_name}
                                        </div>
                                      ))
                                    ) : (
                                      <div className="px-4 py-2 text-gray-500">
                                        No results found
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </td>

                      <td className="">
                        <FormField
                          control={form.control}
                          name={`diagnoses.${index}.ICD_Code`}
                          render={({ field }) => (
                            <FormItem className="m-2">
                              <FormControl>
                                <Input {...field} value={field.value} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </td>

                      <td className="">
                        <FormField
                          control={form.control}
                          name={`diagnoses.${index}.fromDate`}
                          render={({ field }) => (
                            <FormItem className="m-2">
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

                      <td className="">
                        <FormField
                          control={form.control}
                          name={`diagnoses.${index}.toDate`}
                          render={({ field }) => (
                            <FormItem className="m-2">
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

                      <td className="">
                        <FormField
                          control={form.control}
                          name={`diagnoses.${index}.status`}
                          render={({ field }) => (
                            <FormItem className="m-2">
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

                      <td className="">
                        <FormField
                          control={form.control}
                          name={`diagnoses.${index}.notes`}
                          render={({ field }) => (
                            <FormItem className="m-2">
                              <FormControl>
                                <Input {...field} value={field.value} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </td>

                      {fields.length > 1 && (
                        <td className="">
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
                    onClick={() =>
                      append({
                        diagnosis_Id: "",
                        ICD_Code: "1",
                        fromDate: "",
                        toDate: "",
                        status: "active",
                        notes: "",
                      })
                    }
                  >
                    Add More
                  </GhostButton>
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
