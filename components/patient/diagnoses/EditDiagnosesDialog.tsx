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
import SubmitButton from "@/components/custom_buttons/SubmitButton";
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

interface EditDiagnosisDialogProps {
  isOpen: boolean;
  diagnosisData: DiagnosesInterface | undefined;
  onFetchDiagnosesData: (page: number) => Promise<void>;
  onClose: () => void;
}

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
      // ! These fields need confirmation
      fromDate:
        diagnosisData?.createdAt ?? new Date().toISOString().split("T")[0],
      toDate: new Date().toISOString().split("T")[0],
      status: (diagnosisData?.status as "active" | "inactive") ?? "active",
      notes: diagnosisData?.notes || "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof editDiagnosisSchema>> = async (
    values: z.infer<typeof editDiagnosisSchema>
  ) => {
    setLoading(true);

    const requestData: UpdateDiagnosesRequestBody = {
      diagnosis_name: diagnosisData?.diagnosis_name ?? "",
      ICD_Code: diagnosisData?.ICD_Code,
      notes: values.notes,
      status: values.status,
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
        fromDate:
          diagnosisData?.createdAt ?? new Date().toISOString().split("T")[0],
        toDate: new Date().toISOString().split("T")[0],
        status: (diagnosisData?.status as "active" | "inactive") ?? "active",
        notes: diagnosisData?.notes ?? "",
      });
    }
  }, [diagnosisData, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Diagnosis</DialogTitle>
        </DialogHeader>

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
              <td className="px-3 py-2">{diagnosisData?.ICD_Code ?? ""}</td>
            </tr>
            <tr>
              <td className="px-3 py-2"></td>
            </tr>
            <tr>
              <td className="px-3 py-2"></td>
            </tr>
          </tbody>
        </table>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-3"
          >
            {/* From Date */}
            <FormField
              control={form.control}
              name="fromDate"
              render={({ field }) => (
                <FormItem>
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
                <FormItem>
                  <FormLabel>To Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
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
                      <SelectItem value="inactive" className="cursor-pointer">
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
                <FormItem>
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
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
