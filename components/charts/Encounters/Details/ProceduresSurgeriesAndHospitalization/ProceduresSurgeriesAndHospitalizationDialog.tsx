import React, { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addProceduresSurgeriesAndHospitalizationFormSchema } from "@/schema/addProceduresSurgeriesAndHospitalizationSchma";
import {
  createProcedure,
  getAllProcedureNameTypes,
  updateProcedureData,
} from "@/services/chartDetailsServices";
import {
  ProceduresTypesInterface,
  UpdateProceduresInterface,
} from "@/types/procedureInterface";
import { useToast } from "@/hooks/use-toast";
import { showToast } from "@/utils/utils";
import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";

const ProceduresSurgeriesAndHospitalizationDialog = ({
  userDetailsId,
  procedureData,
  onClose,
  isOpen,
}: {
  userDetailsId: string;
  procedureData?: UpdateProceduresInterface | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [procedureListData, setProcedureListData] = useState<
    ProceduresTypesInterface[]
  >([]);
  const [procedureId, setProcedureId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  // const [isListVisible, setIsListVisible] = useState<boolean>(false);
  const [filteredProcedures, setFilteredProcedures] = useState<
    ProceduresTypesInterface[]
  >([]);
  const { toast } = useToast();

  const fetchAllProcedures = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getAllProcedureNameTypes();

      if (response) {
        setProcedureListData(response.data);
      }
    } catch (err) {
      if (err instanceof Error) {
        showToast({
          toast,
          type: "error",
          message: "Could not fetch supplements data",
        });
      }
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const form = useForm<
    z.infer<typeof addProceduresSurgeriesAndHospitalizationFormSchema>
  >({
    resolver: zodResolver(addProceduresSurgeriesAndHospitalizationFormSchema),
    defaultValues: {
      type: procedureData?.type || "",
      name: procedureData?.nameId || "",
      fromDate:
        procedureData?.fromDate || new Date().toISOString().split("T")[0],
      toDate: procedureData?.toDate || new Date().toISOString().split("T")[0],
      notes: procedureData?.notes || "",
    },
  });

  useEffect(() => {
    fetchAllProcedures();
  }, [fetchAllProcedures]);

  useEffect(() => {
    if (procedureData) {
      form.reset({
        type: procedureData?.type || "",
        name: procedureData?.nameId || "",
        fromDate:
          procedureData?.fromDate || new Date().toISOString().split("T")[0],
        toDate: procedureData?.toDate || new Date().toISOString().split("T")[0],
        notes: procedureData?.notes || "",
      });
      if (procedureData.nameId) {
        setProcedureId(procedureData.nameId);
      }
      if (procedureData.nameType.name) {
        setSearchTerm(procedureData.nameType.name);
      }
    }
  }, [procedureData, form]);

  const onSubmit = async (
    values: z.infer<typeof addProceduresSurgeriesAndHospitalizationFormSchema>
  ) => {
    setSubmitLoading(true);
    try {
      if (!procedureData) {
        const requestData = {
          type: values.type ?? "",
          nameId: procedureId,
          fromDate: values.fromDate ?? "",
          toDate: values.toDate ?? "",
          notes: values.notes ?? "",
          userDetailsId,
        };
        const response = await createProcedure({ requestData: requestData });
        if (response) {
          showToast({
            toast,
            type: "success",
            message: "Added procedure successfully",
          });
        }
      } else {
        const requestData = {
          type: values.type ?? "",
          nameId: procedureId,
          fromDate: values.fromDate ?? "",
          toDate: values.toDate ?? "",
          notes: values.notes ?? "",
          userDetailsId,
        };
        const response = await updateProcedureData({
          requestData: requestData,
          id: procedureData.id,
        });
        if (response) {
          showToast({
            toast,
            type: "success",
            message: "Edited procedure successfully",
          });
        }
      }
      onClose();
    } catch (e) {
      console.log("Error:", e);
      showToast({
        toast,
        type: "error",
        message: "Failed to create a procedure",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  useEffect(() => {
    setFilteredProcedures(
      procedureListData.filter((procedure) =>
        procedure.name
          .toLocaleLowerCase()
          .includes(searchTerm.toLocaleLowerCase())
      )
    );
  }, [searchTerm, procedureListData]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {procedureData ? "Update Procedure" : "Add Procedure"}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="w-fit">Type</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={procedureData ? true : false}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="procedure">Procedure</SelectItem>
                          <SelectItem value="surgeries">Surgeries</SelectItem>
                          <SelectItem value="hospitalization">
                            Hospitalization
                          </SelectItem>
                          <SelectItem value="other_events">
                            Other Events
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
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="">Name</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose type" />
                        </SelectTrigger>
                        <SelectContent>
                          {loading ? (
                            <div>Loading...</div>
                          ) : filteredProcedures.length > 0 ? (
                            filteredProcedures.map((procedure) => (
                              <SelectItem
                                key={procedure.id}
                                value={procedure.id}
                                onClick={() => {
                                  field.onChange(procedure.name);
                                  setSearchTerm(procedure.name);
                                  setProcedureId(procedure.id);
                                  // setIsListVisible(false);
                                }}
                              >
                                {procedure.name}
                              </SelectItem>
                            ))
                          ) : (
                            <div className="px-4 py-2 text-gray-500">
                              No results found
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="fromDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From Date:</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="toDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>To Date:</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <SubmitButton
                label={submitLoading ? "Saving..." : "Save"}
                disabled={submitLoading}
              />
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProceduresSurgeriesAndHospitalizationDialog;
