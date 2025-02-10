import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
import {
  Select,
  SelectValue,
  SelectItem,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { vaccinesFormSchema } from "@/schema/vaccinesSchema";
import {
  createHistoricalVaccine,
  updateHistoricalVaccine,
} from "@/services/chartDetailsServices";
import { RootState } from "@/store/store";
import {
  CreateHistoricalVaccineType,
  HistoricalVaccineInterface,
} from "@/types/chartsInterface";
import { showToast } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";
import formStyles from "@/components/formStyles.module.css";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
};

function VaccinesDialog({
  isOpen,
  userDetailsId,
  vaccinesData,
  onClose,
  onFetchHistoricalData,
}: {
  isOpen: boolean;
  userDetailsId: string;
  vaccinesData?: HistoricalVaccineInterface;
  onClose: () => void;
  onFetchHistoricalData: () => void;
}) {
  // Provider Details
  const providerDetails = useSelector((state: RootState) => state.login);

  // Loading State
  const [loading, setLoading] = useState<boolean>(false);

  // Toast State
  const { toast } = useToast();

  // Form State
  const form = useForm<z.infer<typeof vaccinesFormSchema>>({
    resolver: zodResolver(vaccinesFormSchema),
    defaultValues: {
      vaccine_name: vaccinesData?.vaccine_name ?? "",
      in_series: vaccinesData?.in_series ?? "",
      date: vaccinesData?.date
        ? formatDate(vaccinesData.date)
        : new Date().toISOString().split("T")[0],
      source: vaccinesData?.source ?? "",
      notes: vaccinesData?.notes ?? "",
    },
  });

  const onSubmit = async (values: z.infer<typeof vaccinesFormSchema>) => {
    const finalVaccineData: CreateHistoricalVaccineType = {
      ...values,
      userDetailsId,
      providerId: providerDetails.providerId,
    };

    setLoading(true);
    try {
      if (providerDetails) {
        if (vaccinesData) {
          await updateHistoricalVaccine({
            id: vaccinesData.id,
            requestData: finalVaccineData,
          });
        } else {
          await createHistoricalVaccine({ requestData: finalVaccineData });
        }
      }

      showToast({
        toast,
        type: "success",
        message: vaccinesData
          ? "Vaccine updated successfully"
          : "Vaccine created successfully",
      });
    } catch (e) {
      if (e instanceof Error) {
        showToast({
          toast,
          type: "error",
          message: "Vaccine creation failed",
        });
      } else {
        showToast({
          toast,
          type: "error",
          message: "Vaccine creation failed. An unknown error occurred",
        });
      }
    } finally {
      form.reset();
      setLoading(false);
      onFetchHistoricalData();
      onClose();
    }
  };

  useEffect(() => {
    if (vaccinesData) {
      form.reset(vaccinesData);
    } else {
      form.reset({
        vaccine_name: "",
        in_series: "",
        date: new Date().toISOString().split("T")[0],
        source: "",
        notes: "",
      });
    }
  }, [form, vaccinesData]);

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {vaccinesData ? "Edit Vaccine" : "Add vaccine"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className={formStyles.formBody}>
              <FormField
                control={form.control}
                name="vaccine_name"
                render={({ field }) => (
                  <FormItem className={formStyles.formItem}>
                    <FormLabel>Vaccine</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="in_series"
                render={({ field }) => (
                  <FormItem className={formStyles.formItem}>
                    <FormLabel className="w-fit"># in Series</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className={formStyles.formItem}>
                    <FormLabel>From Date:</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="w-fit" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem className={formStyles.formItem}>
                    <FormLabel className="w-fit">Source</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose Source" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="source1">Source 1</SelectItem>
                          <SelectItem value="source2">Source 2</SelectItem>
                          <SelectItem value="source3">Source 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className={formStyles.formItem}>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <div className="flex justify-end gap-2 w-fit">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onClose()}
                  >
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

export default VaccinesDialog;
