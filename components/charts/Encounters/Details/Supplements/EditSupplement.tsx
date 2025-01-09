import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { supplementsFormSchema } from "@/schema/supplementsSchema";
import { updateSupplement } from "@/services/chartDetailsServices";
import { UserEncounterData } from "@/types/chartsInterface";
import { SupplementInterface } from "@/types/supplementsInterface";
import { showToast } from "@/utils/utils";
import { Edit2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";

interface EditSupplementProps {
  selectedSupplement: SupplementInterface;
  patientDetails: UserEncounterData;
  fetchSupplements: () => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
};

function EditSupplement({
  selectedSupplement,
  patientDetails,
  fetchSupplements,
}: EditSupplementProps) {
  // Loading State
  const [loading, setLoading] = useState<boolean>(false);

  // Toast State
  const { toast } = useToast();

  const form = useForm<z.infer<typeof supplementsFormSchema>>({
    resolver: zodResolver(supplementsFormSchema),
    defaultValues: {
      supplement: selectedSupplement.supplement || "",
      manufacturer: selectedSupplement.manufacturer || "",
      fromDate:
        formatDate(selectedSupplement?.fromDate) ||
        new Date().toISOString().split("T")[0],
      toDate:
        formatDate(selectedSupplement?.toDate) ||
        new Date().toISOString().split("T")[0],
      status: selectedSupplement?.status || "Active",
      dosage: selectedSupplement.dosage || "",
      unit: selectedSupplement.unit,
      frequency: selectedSupplement.frequency,
      intake_type: selectedSupplement.intake_type,
      comments: selectedSupplement.comments,
    },
  });

  // PATCH Supplement
  const onSubmit = async (values: z.infer<typeof supplementsFormSchema>) => {
    setLoading(true);
    try {
      const supplementData = {
        ...values,
        userDetailsId: patientDetails.userDetails.id,
      };

      await updateSupplement({
        requestData: supplementData,
        supplementId: selectedSupplement.id,
      });

      showToast({
        toast,
        type: "success",
        message: "Supplement updated successfully",
      });
    } catch (err) {
      if (err instanceof Error) {
        showToast({
          toast,
          type: "failed",
          message: "Could not update supplement",
        });
      }
    } finally {
      setLoading(false);
      fetchSupplements();
      form.reset();
    }
  };

  if (loading) {
    return <LoadingButton />;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Edit2Icon color="#84012A" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Supplement</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col justify-center gap-5">
              <FormField
                control={form.control}
                name="supplement"
                render={({ field }) => (
                  <FormItem className="flex gap-2 items-center">
                    <FormLabel>Supplement</FormLabel>
                    <FormControl>
                      <Input
                        defaultValue={selectedSupplement.supplement}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="manufacturer"
                render={({ field }) => (
                  <FormItem className="flex gap-2 items-center">
                    <FormLabel className="w-fit">Manufacturer</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        defaultValue={selectedSupplement.manufacturer}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between">
                <FormField
                  control={form.control}
                  name="fromDate"
                  render={({ field }) => (
                    <FormItem className="flex gap-2 items-center">
                      <FormLabel>From Date:</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          defaultValue={formatDate(
                            selectedSupplement?.fromDate
                          )}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="toDate"
                  render={({ field }) => (
                    <FormItem className="flex gap-2 items-center">
                      <FormLabel>To Date:</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          defaultValue={formatDate(selectedSupplement?.toDate)}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex gap-2 items-center">
                    <FormLabel className="w-fit">Status</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={selectedSupplement.status}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dosage"
                render={({ field }) => (
                  <FormItem className="flex gap-2 justify-center items-center">
                    <FormLabel>Dosage</FormLabel>
                    <FormControl>
                      <Input
                        defaultValue={selectedSupplement.dosage}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem className="flex gap-2 justify-center items-center">
                    <FormLabel className="w-fit">Unit</FormLabel>
                    <FormControl>
                      <Input
                        defaultValue={selectedSupplement.unit}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem className="flex  gap-2 items-center">
                    <FormLabel className="w-fit">Frequency</FormLabel>
                    <FormControl>
                      <Input
                        defaultValue={selectedSupplement.frequency}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="intake_type"
                render={({ field }) => (
                  <FormItem className="flex gap-2 justify-center items-center">
                    <FormLabel className="w-fit">Intake type</FormLabel>
                    <FormControl>
                      <Input
                        defaultValue={selectedSupplement.intake_type}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="comments"
                render={({ field }) => (
                  <FormItem className="flex gap-2 justify-center items-center">
                    <FormLabel>Comments</FormLabel>
                    <FormControl>
                      <Textarea
                        defaultValue={selectedSupplement.comments}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="bg-[#84012A] hover:bg-[#6C011F]"
                disabled={loading}
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditSupplement;

