import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createInjectionSchema } from "@/schema/createInjections";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CreateInjectionInterface } from "@/types/injectionsInterface";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import LoadingButton from "@/components/LoadingButton";
import { createInjection } from "@/services/injectionsServices";
import { showToast } from "@/utils/utils";
import { useToast } from "@/components/ui/use-toast";

const InjectionsDialog = ({
  userDetailsId,
  injectionsData,
  onClose,
  isOpen,
}: {
  userDetailsId: string;
  injectionsData?: null;
  onClose: () => void;
  isOpen: boolean;
}) => {
  const providerDetails = useSelector((state: RootState) => state.login);
  const [loading, setLoading] = React.useState<boolean>(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof createInjectionSchema>>({
    resolver: zodResolver(createInjectionSchema),
    defaultValues: {
      injection_name: "",
      dosage_unit: "",
      dosage_quantity: 0,
      frequency: "",
      period_number: 0,
      period_unit: "",
      parental_route: "",
      site: "",
      lot_number: 0,
      expiration_date: "",
      administered_date: "",
      administered_time: "",
      note_to_nurse: "",
      comments: "",
    },
  });

  useEffect(() => {
    if (injectionsData) {
      console.log(injectionsData);
    }
  }, [injectionsData]);

  const onSubmit = async (values: z.infer<typeof createInjectionSchema>) => {
    console.log(values);
    const requestBody: CreateInjectionInterface = {
      ...values,
      status: "pending",
      userDetailsId,
      providerId: providerDetails.providerId,
    };
    try {
      setLoading(true);
      const response = await createInjection({ requestBody: requestBody });
      if (response) {
        showToast({
          toast,
          type: "success",
          message: "Injection added successfully",
        });
      }
    } catch (error) {
      console.log(error);
      showToast({
        toast,
        type: "error",
        message: " Error while adding Injection",
      });
    } finally {
      setLoading(false);
      form.reset();
      onClose();
    }
  };

  if (loading) {
    return <LoadingButton />;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Injections</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-96 rounded-md">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="injection_name"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter injection to add" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-3">
                <FormField
                  control={form.control}
                  name="dosage_quantity"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-3 mb-1.5">
                      <FormLabel className="">Dosage</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          placeholder="Enter Quantity"
                          className="flex items-center border rounded-md ml-28"
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dosage_unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Unit" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mg">mg</SelectItem>
                            <SelectItem value="unit2">Unit 2</SelectItem>
                            <SelectItem value="unit3">Unit 3</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3">
                    <FormLabel className="w-full">Frequency</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="frequency1">
                            Frequency 1
                          </SelectItem>
                          <SelectItem value="frequency2">
                            Frequency 2
                          </SelectItem>
                          <SelectItem value="frequency3">
                            Frequency 3
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-3">
                <FormField
                  control={form.control}
                  name="period_number"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-4 mb-1.5">
                      <FormLabel className="">Period</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          placeholder="Enter Quantity"
                          className="flex items-center border rounded-md ml-28"
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="period_unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Unit" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Days">Day(s)</SelectItem>
                            <SelectItem value="Weeks">Week(s)</SelectItem>
                            <SelectItem value="months">Month(s)</SelectItem>
                            <SelectItem value="years">Year(s)</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="parental_route"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3">
                    <FormLabel className="w-full">Parenteral Route</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Parenteral Route" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="parenteralRoute1">
                            Parenteral Route 1
                          </SelectItem>
                          <SelectItem value="parenteralRoute2">
                            Parenteral Route 2
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="site"
                render={({ field }) => (
                  <FormItem className="flex items-center">
                    <FormLabel className="w-full">Site</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Site" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="site1">Site 1</SelectItem>
                          <SelectItem value="site2">Site 2</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lot_number"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3">
                    <FormLabel>Lot number</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.valueAsNumber)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expiration_date"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3">
                    <FormLabel>Expiration Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="administered_date"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3">
                    <FormLabel>Administered Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="administered_time"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3">
                    <FormLabel>Administered Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="note_to_nurse"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3">
                    <FormLabel>Note to nurse</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="comments"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3">
                    <FormLabel>Comments</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="bg-[#84012A] w-full">
                Submit
              </Button>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default InjectionsDialog;
