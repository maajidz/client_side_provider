import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
            <div className="flex flex-col gap-5">
              <FormField
                control={form.control}
                name="vaccine_name"
                render={({ field }) => (
                  <FormItem className="flex gap-2 items-center">
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
                  <FormItem className="flex gap-2 items-center">
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
                  <FormItem className="flex gap-2 items-center">
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
                name="source"
                render={({ field }) => (
                  <FormItem className="flex gap-2 items-center">
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
                  <FormItem className="flex gap-2 items-center">
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-row-reverse gap-4">
                <Button
                  type="submit"
                  className="bg-[#84012A] hover:bg-[#6C011F]"
                  disabled={loading}
                >
                  Save
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="bg-slate-200 hover:bg-slate-100"
                  onClick={() => onClose()}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default VaccinesDialog;
