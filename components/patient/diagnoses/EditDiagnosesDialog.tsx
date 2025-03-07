import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";
import { useToast } from "@/hooks/use-toast";
import { editDiagnosisSchema } from "@/schema/diagnosesSchema";
import { updateDiagnoses } from "@/services/chartsServices";
import {
  DiagnosesInterface,
  UpdateDiagnosesRequestBody,
} from "@/types/chartsInterface";
import { zodResolver } from "@hookform/resolvers/zod";
import { showToast } from "@/utils/utils";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EditDiagnosisDialogProps {
  isOpen: boolean;
  diagnosisData: DiagnosesInterface | null;
  onFetchDiagnosesData: (page: number) => Promise<void>;
  onClose: () => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
};

export default function EditDiagnosisDialog({
  isOpen,
  diagnosisData,
  onFetchDiagnosesData,
  onClose,
}: EditDiagnosisDialogProps) {
  // Loading State
  const [loading, setLoading] = useState(false);

  // Toast State
  const { toast } = useToast();

  // Form State
  const form = useForm({
    resolver: zodResolver(editDiagnosisSchema),
    defaultValues: {
      fromDate: diagnosisData?.fromDate
        ? formatDate(diagnosisData?.fromDate)
        : new Date().toISOString().split("T")[0],
      toDate: diagnosisData?.toDate
        ? formatDate(diagnosisData?.toDate)
        : new Date().toISOString().split("T")[0],
      status: (diagnosisData?.status as "active" | "inactive") ?? "active",
      notes: diagnosisData?.notes || "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof editDiagnosisSchema>> = async (
    values: z.infer<typeof editDiagnosisSchema>
  ) => {
    setLoading(true);

    const requestData: UpdateDiagnosesRequestBody = {
      diagnosis_Id: diagnosisData?.diagnosis_Id ?? "",
      // ICD_Code: diagnosisData?.ICD_Code,
      notes: values.notes,
      status: values.status,
      fromDate: values.fromDate,
      toDate: values.toDate,
    };

    try {
      if (diagnosisData?.id) {
        await updateDiagnoses({
          requestData,
          diagnosisId: diagnosisData?.id,
        });
      }

      showToast({
        toast,
        type: "success",
        message: "The diagnosis data updated successfully",
      });
    } catch (err) {
      if (err instanceof Error) {
        showToast({
          toast,
          type: "error",
          message: "The diagnosis data update failed",
        });
      }
    } finally {
      onClose();
      form.reset();
      setLoading(false);
      await onFetchDiagnosesData(1);
    }
  };

  useEffect(() => {
    if (diagnosisData) {
      form.reset({
        fromDate: diagnosisData?.fromDate
          ? formatDate(diagnosisData?.fromDate)
          : new Date().toISOString().split("T")[0],
        toDate: diagnosisData?.toDate
          ? formatDate(diagnosisData?.toDate)
          : new Date().toISOString().split("T")[0],
        status: (diagnosisData?.status as "active" | "inactive") ?? "active",
        notes: diagnosisData?.notes ?? "",
      });
    }
  }, [diagnosisData, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90dvh] h-auto">
        <DialogHeader>
          <DialogTitle>Edit Diagnosis</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[30rem] h-auto flex gap-6 flex-col">
          <div className="flex flex-col gap-6">
          <table className="w-full border rounded-md">
            <thead>
              <tr className="border-b bg-[#eeeeee] ">
                <th className="px-3 py-2 text-left">Code Type</th>
                <th className="px-3 py-2 text-left">Code</th>
                <th className="px-3 py-2 text-left">Name</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                {/* <td className="px-3 py-2">{diagnosisData?.ICD_Code ?? ""}</td> */}
              </tr>
              <tr>
                <td className="px-3 py-2"></td>
              </tr>
              <tr>
                <td className="px-3 py-2">{diagnosisData?.diagnosis_Id}</td>
              </tr>
            </tbody>
          </table>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {/* From Date */}
              <div className="flex flex-col gap-6">
                <div className="flex flex-row gap-2 items-end">
                <FormField
                  control={form.control}
                  name="fromDate"
                  render={({ field }) => (
                    <FormItem >
                      <label>From Date</label>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* To Date */}
                <FormField
                  control={form.control}
                  name="toDate"
                  render={({ field }) => (
                    <FormItem >
                      <FormLabel>To Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                </div>

                {/* Status */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem >
                      <FormLabel>Select Status</FormLabel>
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
                          <SelectItem value="active" className="cursor-pointer">
                            Active
                          </SelectItem>
                          <SelectItem
                            value="inactive"
                            className="cursor-pointer"
                          >
                            Inactive
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Notes */}
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem >
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Enter notes"
                          value={field.value}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      type="button"
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
              </div>
            </form>
          </Form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
