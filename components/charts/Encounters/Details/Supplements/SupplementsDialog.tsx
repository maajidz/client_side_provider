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
import { createSupplement } from "@/services/chartDetailsServices";
import { UserEncounterData } from "@/types/chartsInterface";
import { showToast } from "@/utils/utils";
import { PlusCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
interface SupplementsDialogProps {
  patientDetails: UserEncounterData;
}

function SupplementsDialog({ patientDetails }: SupplementsDialogProps) {
  // Loading State
  const [loading, setLoading] = useState<boolean>(false);

  // Toast State
  const { toast } = useToast();

  const form = useForm<z.infer<typeof supplementsFormSchema>>({
    resolver: zodResolver(supplementsFormSchema),
    defaultValues: {
      supplement: "",
      manufacturer: "",
      fromDate: new Date().toISOString().split("T")[0],
      toDate: new Date().toISOString().split("T")[0],
      status: "Active",
      dosage: "",
      unit: "",
      frequency: "",
      intake_type: "",
      comments: "",
    },
  });

  // POST Supplement
  const onSubmit = async (values: z.infer<typeof supplementsFormSchema>) => {
    setLoading(true);
    try {
      const supplementData = {
        ...values,
        userDetailsId: patientDetails.userDetails.id,
      };

      await createSupplement(supplementData);

      showToast({
        toast,
        type: "success",
        message: "Supplement created successfully",
      });
    } catch (err) {
      if (err instanceof Error) {
        showToast({
          toast,
          type: "failed",
          message: "Supplement creation failed",
        });
      }
    } finally {
      setLoading(false);
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
          <PlusCircle />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Supplement</DialogTitle>
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
                      <Input {...field} />
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
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose Manufacturer" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="love_wellness">
                            Love Wellness
                          </SelectItem>
                          <SelectItem value="manufacturer2">
                            Manufacturer 2
                          </SelectItem>
                          <SelectItem value="manufacturer3">
                            Manufacturer 3
                          </SelectItem>
                        </SelectContent>
                      </Select>
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
                    <FormItem className="flex gap-2 items-center">
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
                name="status"
                render={({ field }) => (
                  <FormItem className="flex gap-2 items-center">
                    <FormLabel className="w-fit">Status</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
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
                      <Input {...field} />
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
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gram">gram</SelectItem>
                          <SelectItem value="mg">mg</SelectItem>
                          <SelectItem value="ml">ml</SelectItem>
                          <SelectItem value="tablet(s)">tablet(s)</SelectItem>
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
                  <FormItem className="flex  gap-2 items-center">
                    <FormLabel className="w-fit">Frequency</FormLabel>
                    <FormControl>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="once_day">Once a day</SelectItem>
                          <SelectItem value="twice_day">Twice a day</SelectItem>
                          <SelectItem value="three_day">
                            Three times a day
                          </SelectItem>
                          <SelectItem value="week">Once a week</SelectItem>
                        </SelectContent>
                      </Select>
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
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose Intake Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="away_from_meals">
                            Away From Meals
                          </SelectItem>
                          <SelectItem value="with_breakfast">
                            With Breakfast
                          </SelectItem>
                          <SelectItem value="with_dinner">
                            With Dinner
                          </SelectItem>
                          <SelectItem value="at_bedtime">At Bedtime</SelectItem>
                        </SelectContent>
                      </Select>
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
                      <Textarea {...field} />
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

export default SupplementsDialog;
